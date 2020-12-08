import React from 'react'
import GoogleMapReact from 'google-map-react'
import apiService from '../../services/ApiService'
import SearchBarComponent from '../SearchBar'
import './Home.scss'
// import SearchHistory from '../SearchHistory'

require('dotenv').config()

const AnyReactComponent = ({ text }) =>

    <div style={{
        position: 'absolute',
        left: -50 / 2,
        top: -50 / 2,
        border: '1px solid #f44336',
        height: 50,
        width: 50,
        borderRadius: 2000,
    }}>
        <div style={{
            width: 30,
            height: 30,
            marginTop: 10,
            marginLeft: 10,
            border: '5px solid #f44336',
            borderRadius: 40,
            backgroundColor: 'white',
            textAlign: 'center',
            color: '#3f51b5',
            fontSize: 12,
            fontWeight: 'bold',
            padding: 2
        }}>
            {text}
        </div>
    </div>;

class Home extends React.Component {
    // Define the cordinate of Singapore and load the google map with the zoom of level 11.4
    static defaultProps = {
        center: {
            lat: 1.360270,
            lng: 103.851759
        },
        zoom: 11.6
    }

    constructor(props) {
        super(props)
        this.state = {
            dengueClusters: [],
            history: [],
            apiReady: true,
            currentLatLng: this.props.center,
            searchPosition: {
                lat: 0,
                lng: 0
            },
            // zoom: 0
        }
    }

    passpropstosearchHistory = (obj) => {
        this.setState({ history: [...this.state.history, ...obj] })
    }

    // Get the Dengue Clusters data from NEA through backend. Daily update
    getDengueClusters() {
        apiService.getDengueClusters()
            .then(response => {
                this.setState({
                    dengueClusters: response.data
                })
            })
            .catch(err => {
                console.log(err)
            })
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


    handleNewAddress = (addressValue) => {
        const searchPosition = addressValue.split(',')
        this.setState({
            currentLatLng: {
                lat: Number(searchPosition[0]),
                lng: Number(searchPosition[1]),
            },
            zoom: 14,
            radius: 111,
            options: {
                strokeColor: "#ff0000"
            }
        })
    }

    componentDidMount() {
        this.getDengueClusters()

    }

    render() {
        this.getCurrentLocation()

        // Define the Google Map API Key
        const API_KEY = process.env.REACT_APP_GOOGLE_MAP_API

        const handleApiLoaded = (map, maps) => {

            // Draw the Dengue Cluster zone based on the Latitude and Longtitude provided
            let clustersArray = this.state.dengueClusters

            clustersArray.forEach(clusterCoords => {
                var clusters = new maps.Polygon({
                    paths: clusterCoords,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35
                });
                clusters.setMap(map);
            })

            // let marker = new maps.Marker({
            //     position: this.state.currentLatLng,
            //     map,
            //     title: "Current Location"
            // })

            // let circle = new maps.Circle({
            //     // center: this.state.currentLatLng,
            //     // radius: 111,
            //     // fillColor: 'AA0000',
            //     // fillOpacity: 0.1,
            //     // map,
            //     // strokeColor: "#FFFFFF",
            //     // strokeOpacity: 0.1,
            //     // strokeWeight: 2,
            //     // strokeColor: "#FF0000",

            //     strokeOpacity: 0.8,
            //     strokeWeight: 2,
            //     fillColor: "#FF0000",
            //     fillOpacity: 0.35,
            //     map,
            //     center: this.state.currentLatLng,
            //     radius: 1000,
            // })
            // circle.bindTo('center', marker, 'position')
            // circle.setMap(map)
        }
        // this.getDengueClusters()

        return (

            <div className="container main-home-container">
                <div className="row">
                    {/* Important! Always set the container height explicitly */}
                    <div className="col-8">
                        <div className="map">
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: API_KEY }}
                                defaultCenter={this.props.center}
                                defaultZoom={this.props.zoom}

                                center={this.state.currentLatLng}
                                zoom={this.state.zoom}
                                yesIWantToUseGoogleMapApiInternals
                                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                            >

                                <AnyReactComponent
                                    // lat={this.state.currentLatLng.lat}
                                    // lng={this.state.currentLatLng.lng}
                                    text='A'
                                />

                            </GoogleMapReact>
                        </div>
                        <div className="search-bar">
                            <SearchBarComponent onNewAddress={this.handleNewAddress} />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="home-card">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas dicta, laborum ab est a laudantium. Beatae, iusto maxime labore expedita nihil nam, eum asperiores, reprehenderit dolorem consequuntur nisi dolores officiis.
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}


export default Home