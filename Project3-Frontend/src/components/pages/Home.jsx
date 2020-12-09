import React from 'react'
import { Map, Marker, Circle, InfoWindow, GoogleApiWrapper, Polygon } from 'google-maps-react'
import apiService from '../../services/ApiService'
import SearchBarComponent from '../SearchBar'
import SearchHistoryComponent from '../SearchHistory'
import './Home.scss'
import Axios from 'axios'
import SearchResult from '../SearchResult'

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
            dengueClusters: [],
            redDengueClusters: [],
            yellowDengueClusters: [],
            loggedIn: false,
            currentLocationUrl: "",
            alreadyLocation: [],
            history: [],
            zoom: 11.5,
            searchPosition: {
                lat: 0,
                lng: 0
            },
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
                    }
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

            zoom: 15.5,
            showDistanceBox: false,
            showMsg: ""
        }, () => {
            Axios.post("http://localhost:5000/api/v1/getNearestRiskAreaDistance", { "LatLng": addressValue.latLng })
                .then(res => {
                    let data = res.data
                    if (data) {
                        let msg = ""
                        if (data.isWithinRiskArea) {
                            msg = `You are within ${data.minimumDistance} metres of a <span style='color:${data.riskAreaColor}'> high risk</span> area.`
                        } else {
                            msg = `You are more than 150 metres from the high risk area`
                        }

                        /// write code to save user location in db and return saved places
                        // it should be a async await request 
                        console.log("12")
                        let tempAlready = JSON.parse(JSON.stringify(this.state.alreadyLocation))
                        tempAlready = [...tempAlready, ...[{ ...addressValue, ...data }]]
                        this.setState({
                            showDistanceBox: true,
                            alreadyLocation: tempAlready,
                            showMsg: msg
                        })
                    }
                })
        })
    }

    passpropstosearchHistory = (obj) => {
        this.setState({ history: [...this.state.history, ...obj] })
    }

    componentDidMount() {
        this.getDengueClusters()
    }

    render() {
        console.log("1313131")
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
                            >

                                <Marker
                                    position={this.state.currentLatLng}
                                    onMouseover={this.onMouseoverMarker}
                                    name={'Current location'}
                                />

                                <Polygon
                                    paths={yellowDengueClusters}
                                    strokeColor="#FFD400"
                                    strokeOpacity={0.8}
                                    strokeWeight={2}
                                    fillColor="#FFD400"
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
                                    onMouseover={() => console.log('mouseover')}
                                    onClick={() => console.log('click')}
                                    onMouseout={() => console.log('mouseout')}
                                    strokeColor='#0000FF'
                                    strokeOpacity={0.9}
                                    strokeWeight={2}
                                    fillColor='#0000FF'
                                    fillOpacity={0.2}
                                />
                            </Map>
                        </div>
                    </div>
                    <div className="col search-bar">
                        <div className="row">
                            <SearchBarComponent onNewAddress={this.handleNewAddress} />
                        </div>
                        <div className="row card-component">
                            {!this.state.loggedIn && <SearchResult
                                isLoggedIn={this.state.loggedIn}
                                showDistanceBox={this.state.showDistanceBox}
                                message={this.state.showMsg} />}
                            {this.state.loggedIn && <SearchHistoryComponent history={this.state.alreadyLocation} />}
                        </div>
                    </div>

                </div>


            </div>


        );
    }
}

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API)
})(Home)