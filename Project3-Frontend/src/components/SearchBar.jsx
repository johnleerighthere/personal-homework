// import Axios from 'axios';
import React from 'react';
// import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    // geocodeByPlaceId,
    getLatLng,
} from 'react-places-autocomplete';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './SearchBar.scss'




class SearchBarComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            area: '',
            address: '',
            latLng: null,
            searchContent: {},
            searchLocation: false
        }
    }
    inputChange = (event) => {
        this.setState({ area: event.target.value });
    }
    submitData = () => {
        if (!this.state.address) {
            console.log("enter some address")
            toastr.error("Please enter an address")
            return false
        }
        if (!this.state.latLng) {
            console.log("please select a place from the suggesstions")
            toastr.error("Please select a place from the suggestions")
            return false
        }

        // this.props.onNewAddress({latLng:this.state.latLng, locationText: })
        this.props.onNewAddress({ type: "Other", latLng: this.state.latLng, locationText: this.state.address })
        // const searchContent = { type: "Other", latLng: this.state.latLng, locationText: this.state.address }
        // this.setState({ searchContent: searchContent })
        this.setState({ searchLocation: true })
        this.setState({ latLng: "", address: "" })
    }

    // redirectToHomePage = () => {
    //     if (this.state.searchLocation) {
    //         console.log("searchContent")
    //         console.log(this.state.searchContent)
    //         return <Redirect to={`/map/location/${this.state.searchContent}`} />
    //     }
    // }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        this.setState({ address })

        geocodeByAddress(address)
            .then(results =>
                getLatLng(results[0])
            )
            .then(res =>
                this.setState({
                    latLng: res.lat + "," + res.lng,
                    obj: {
                        latLng: res.lat + "," + res.lng,
                        riskArea: "High", location: address
                    }
                })
            )

            .catch(error => console.error('Error', error));
    };

    render() {
        return (
            <div>
                {/* {this.redirectToHomePage()} */}
                <form>
                    <label id="search-label" style={{ fontWeight: 'bold', color: 'black' }}>Area to check:
                    </label>
                    <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input className="form-group mb-3" id="search-input"
                                    {...getInputProps({
                                        placeholder: 'Search Places ...',
                                        className: 'location-search-input',
                                    })}
                                />

                                <Button id="search-button" type="button" value="Submit" variant="primary" onClick={this.submitData}>Submit</Button>

                                <div className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion, i) => {
                                        const className = suggestion.active
                                            ? 'suggestion-item--active'
                                            : 'suggestion-item';
                                        // inline style for demonstration purpose
                                        const style = suggestion.active
                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                        return (
                                            <div
                                                key={i}
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,
                                                    style,
                                                })}
                                            >
                                                <span>{suggestion.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                            // </div>
                        )}
                    </PlacesAutocomplete>
                </form>
            </div>
        )
    }

}

export default SearchBarComponent