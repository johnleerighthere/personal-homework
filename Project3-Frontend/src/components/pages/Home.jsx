import React from 'react'
import { Map, Marker, Circle, InfoWindow, GoogleApiWrapper, Polygon } from 'google-maps-react'
import apiService from '../../services/ApiService'
import SearchBarComponent from '../SearchBar'
import SearchHistoryComponent from '../SearchHistory'
import './Home.scss'
import Axios from 'axios'
import SearchResult from '../SearchResult'
import { getAuthenticated } from "../helpers/utility"
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

require('dotenv').config()

class Home extends React.Component {

    // Define the cordinate of Singapore and load the google map with the zoom of level 11.4
    static defaultProps = {
        center: {
            lat: 1.360270,
            lng: 103.851759
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            currentLatLng: this.props.center,
            locationText: '',
            dengueClusters: [],
            redDengueClusters: [],
            yellowDengueClusters: [],
            loggedIn: getAuthenticated(),
            currentLocationUrl: "",
            alreadyLocation: [],
            history: [],
            zoom: 11.5,
            searchPosition: {
                lat: 0,
                lng: 0
            },
            activeMarker: {},
            selectedPlace: {},
            showingInfoWindow: false
        }
    }

    getCurrentLocation = () => {
        // finding out if a system geolocation is available or not. Tested and it's available
        // if ("geolocation" in navigator) {
        //     console.log("Available")
        // } else {
        //     console.log("Not Available")
        // }

        // Using navigator.geolocation.watchPosition instead of getCurrentPosition() method so that able to get user postion when user changes location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {

                this.setState({
                    currentLatLng: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    zoom: 12
                })

            },
                (err) => {
                    this.setState({
                        errorMessage: "User denied geolocation",
                        currentLatLng: {
                            lat: this.props.center.lat,
                            lng: this.props.center.lng,
                        }
                    })
                }
            )
        } else {
            this.setState({
                errorMessage: "Geolocation unavailable",
                currentLatLng: {
                    lat: this.props.center.lat,
                    lng: this.props.center.lng,
                }
            })
        }
    }

    // Get the Dengue Clusters data from NEA through backend. Daily update
    getDengueClusters() {
        apiService.getDengueClusters()
            .then(response => {
                const clustersData = response.data
                const dengueClusters = []
                const redDengueClusters = []
                const yellowDengueClusters = []

                clustersData.forEach(cluster => {
                    dengueClusters.push(cluster.coordsArr)
                })

                clustersData.forEach(cluster => {
                    if (cluster.color === "yellow") {
                        yellowDengueClusters.push(cluster.coordsArr)
                    } else if (cluster.color === "red") {
                        redDengueClusters.push(cluster.coordsArr)
                    }
                })

                this.setState({
                    dengueClusters: dengueClusters,
                    redDengueClusters: redDengueClusters,
                    yellowDengueClusters: yellowDengueClusters
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleNewAddress = (addressValue) => {

        const searchPosition = addressValue.latLng.split(',')
        this.setState({
            currentLatLng: {
                lat: Number(searchPosition[0]),
                lng: Number(searchPosition[1]),
            },
            locationText: addressValue.locationText,
            zoom: 15.5,
            showDistanceBox: false,
            showMsg: ""
        }, () => {
            Axios.post("https://dengueheatmapbackend.herokuapp.com/api/v1/getNearestRiskAreaDistance", { "LatLng": addressValue.latLng })
                .then(async res => {
                    let data = res.data
                    if (data) {
                        let msg = ""
                        if (data.isWithinRiskArea) {
                            let riskColor
                            if (data.riskAreaColor === "yellow") {
                                riskColor = "#fdb827"
                            } else if (data.riskAreaColor === "red") {
                                riskColor = "#f05454"
                            }
                            msg = `is within ${Math.round(data.minimumDistance)} metres of a <span style='color:${riskColor}'> high risk</span> area.`
                        } else {
                            msg = `is more than 150 metres from the high risk area`
                        }

                        /// write code to save user location in db and return saved places
                        // it should be a async await request 
                        if (this.state.loggedIn) {
                            let userObj = JSON.parse(localStorage.getItem("userObj"))
                            let res = await Axios.post("https://dengueheatmapbackend.herokuapp.com/api/v1/addUserSavedLocations", { email: userObj.email, item: { ...addressValue, ...data, tempID: new Date().toISOString() } })
                            if (res.data && res.data.success) {
                                toastr.success("Item added successfully")
                                this.getLatestUserData()
                            } else {
                                toastr.error(res.data.message)
                            }
                        } else {
                            this.setState({
                                showDistanceBox: true,
                                showMsg: msg
                            })
                        }


                    }
                })
        })
    }

    passpropstosearchHistory = (obj) => {
        this.setState({ history: [...this.state.history, ...obj] })
    }

    componentDidMount() {
        this.getDengueClusters()
        this.getLatestUserData()
    }

    async getLatestUserData() {
        if (this.state.loggedIn) {
            let userObj = JSON.parse(localStorage.getItem("userObj"))
            let response = await Axios.post("https://dengueheatmapbackend.herokuapp.com/api/v1/getUsersSavedLocations", { email: userObj.email })
            if (response.data && response.data.success) {
                localStorage.setItem("userObj", JSON.stringify(response.data.userDetails))
                this.setState({ alreadyLocation: response.data.searchLocation })
            }
        }
    }

    onMarkerClick = (props, marker) =>
        this.setState({
            activeMarker: marker,
            selectedPlace: props,
            showingInfoWindow: true
        })

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        })

    // onMapClicked = () => {
    //     if (this.state.showingInfoWindow)
    //         this.setState({
    //             activeMarker: this.props.center,
    //             showingInfoWindow: false
    //         })
    // }

    render() {
        this.getCurrentLocation()

        const yellowDengueClusters = this.state.yellowDengueClusters
        const redDengueClusters = this.state.redDengueClusters

        return (
            <div className="container-fluid main-home-container">
                <div className="row">
                    {/* Important! Always set the container height explicitly */}
                    <div className="col-8">
                        <div className="map">
                            <Map
                                google={this.props.google}
                                initialCenter={this.props.center}
                                zoom={this.state.zoom}
                                center={this.state.currentLatLng}
                                scrollwheel={true}
                            // onMouseover={this.onMapClicked}
                            >

                                <Marker
                                    position={this.state.currentLatLng}
                                    name={this.state.locationText}
                                    onMouseover={this.onMarkerClick}
                                    onMouseout={this.onInfoWindowClose}
                                />

                                <Polygon
                                    paths={yellowDengueClusters}
                                    strokeColor="#FFA500"
                                    strokeOpacity={0.8}
                                    strokeWeight={2}
                                    fillColor="#FFA500"
                                    fillOpacity={0.35}
                                />

                                <Polygon
                                    paths={redDengueClusters}
                                    strokeColor="#FF0000"
                                    strokeOpacity={0.8}
                                    strokeWeight={2}
                                    fillColor="#FF0000"
                                    fillOpacity={0.35}
                                />

                                <Circle
                                    radius={150}
                                    center={this.state.currentLatLng}
                                    strokeColor='#0000FF'
                                    strokeOpacity={0.9}
                                    strokeWeight={2}
                                    fillColor='#0000FF'
                                    fillOpacity={0.2}
                                />

                                <InfoWindow
                                    marker={this.state.activeMarker}
                                    onClose={this.onInfoWindowClose}
                                    visible={this.state.showingInfoWindow}
                                >
                                    <div>
                                        <h6>{this.state.selectedPlace.name}</h6>
                                    </div>
                                </InfoWindow>
                            </Map>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="row mb-2">
                            <SearchBarComponent onNewAddress={this.handleNewAddress} />
                        </div>


                        <div className="row card-component">
                            {!this.state.loggedIn && <SearchResult
                                isLoggedIn={this.state.loggedIn}
                                showDistanceBox={this.state.showDistanceBox}
                                message={this.state.showMsg}
                                locationText={this.state.locationText} />}
                            {this.state.loggedIn && <SearchHistoryComponent history={this.state.alreadyLocation} />}
                        </div>

                    </div>
                </div>

            </div >


        );
    }
}

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API)
})(Home)