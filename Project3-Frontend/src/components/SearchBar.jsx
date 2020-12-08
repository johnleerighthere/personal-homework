// import Axios from 'axios';
import React from 'react';
import { Button } from 'react-bootstrap';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    // geocodeByPlaceId,
    getLatLng,
} from 'react-places-autocomplete';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';



class SearchBarComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            area: "",
            latLng: null
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

        this.props.onNewAddress(this.state.latLng)
        this.setState({ latLng: "" })
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        this.setState({ address })
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(res => this.setState({ latLng: res.lat + "," + res.lng, obj: { latLng: res.lat + "," + res.lng, riskArea: "High", location: address } }))
            .catch(error => console.error('Error', error));
    };

    render() {
        return (
            <div>

                <form className="form-inline">
                    <label id="search-label" style={{ fontWeight: 'bold', color: 'black' }}>Area to check:
                    </label>
                    <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input className="form-group mb-2" id="search-input"
                                    {...getInputProps({
                                        placeholder: 'Search Places ...',
                                        className: 'location-search-input',
                                    })}
                                />
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
                        )}
                    </PlacesAutocomplete>
                    <Button id="search-button" type="button" value="Submit" variant="primary" onClick={this.submitData}>Submit</Button>
                </form>
            </div >
        )
    }

}

export default SearchBarComponent