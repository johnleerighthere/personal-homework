import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { FaEdit, FaSpinner } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    // geocodeByPlaceId,
    getLatLng,
} from 'react-places-autocomplete';

class SearchHistory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            savedLocations: []
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ savedLocations: nextProps.history })
        console.log("old", nextProps.history)
    }

    enableActions = (i, type, value) => {
        // console.log(i, type, value)
        let tempAlreadyArray = JSON.parse(JSON.stringify(this.state.savedLocations))
        tempAlreadyArray[i][type] = value
        this.setState({ savedLocations: tempAlreadyArray }, () => {
            if (type === "delete") {
                var result = window.confirm("Are you sure you want to delete " + this.state.savedLocations[i]["locationText"] + " ?")
                if (result) {
                    toastr.success("item deleted successfully")
                }
            }
        })
    }

    saveDetails = (item, i) => {
        // var result = window.confirm("Are you sure you want to save the detai " + this.state.savedLocations[i]["locationText"] + " ?")
        //         if (result) {
        //             toastr.success("item deleted successfully")
        //         }
        // need a api to save data and retrive the saved locations based on userid
        console.log("new", item)
        toastr.success("Item saved sucessfully")
        this.enableActions(i, "edit", false)
    }

    handleChange = (e, i) => {
        let tempAlreadyArray = JSON.parse(JSON.stringify(this.state.savedLocations))
        tempAlreadyArray[i][e.target.name] = e.target.value
        this.setState({ savedLocations: tempAlreadyArray })
    }

    handleAddressChange = (e, i) => {
        let tempAlreadyArray = JSON.parse(JSON.stringify(this.state.savedLocations))
        console.log(e)
        tempAlreadyArray[i]["locationText"] = e
        this.setState({ savedLocations: tempAlreadyArray })
    }

    handleSelect = (address, i) => {
        this.setState({ address })
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(res => {
                this.setState({ latLng: res.lat + "," + res.lng, obj: { latLng: res.lat + "," + res.lng, location: address } }, () => {
                    this.handleChange({ target: { name: "latLng", value: res.lat + "," + res.lng } }, i)
                })
            }
            )
            .catch(error => console.error('Error', error))
    }

    render() {
        return (
            <div>
                {this.state.savedLocations && this.state.savedLocations.map((item, i) => {
                    return (
                        <Card key={i} border="primary" style={{ width: '18rem' }}>
                            <Card.Header style={{ fontsize: '30px', fontWeight: 'bold', color: 'black' }}>
                                {item.edit ? <input type="text" placeholder="Enter Type" value={item.type} name="type" onChange={(e) => this.handleChange(e, i)} /> : item.type}

                                {/* we dont want save button because we are saving the data to backend oonce the user
                                 submits and in the repsponse of that api we will receive the all saved Locations
                                 based on the user id */}
                                {/* {!checkEditVariable(item.location) && <Button variant="success float-right" type="submit"
                            onClick={() => saveDataToBackend(i, item)}
                        >
                            Save
            </Button>} */}
                            </Card.Header>
                            {!item.edit && <Card.Body>
                                <Card.Title style={{ color: 'red' }}>{item.riskAreaType.toUpperCase()}
                                    &nbsp;<span onClick={() => this.enableActions(i, "delete", true)}><MdDelete /></span>
                                </Card.Title>
                                <Card.Text>
                                    <a href="https://goo.gl/maps/uw3y78Md81Dim72H6">{item.locationText}</a>
                                    &nbsp;<span onClick={() => this.enableActions(i, "edit", true)}><FaEdit style={{ backgroundColor: "yellow" }} /></span>
                                </Card.Text>
                            </Card.Body>}
                            {item.edit && <Card.Body>

                                {/* <input type="text" value={item.locationText} name="locationText" onChange={(e) => this.handleChange(e, i)} placeholder="Enter Address" /> */}
                                <PlacesAutocomplete
                                    value={item.locationText}
                                    onChange={(e) => this.handleAddressChange(e, i)}
                                    onSelect={(e) => this.handleSelect(e, i)}
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
                                {/* here write code for suggesdtion */}
                                <button type="button" onClick={() => this.saveDetails(item, i)}>Save</button>
                            </Card.Body>}
                        </Card >
                    )
                })}

            </div>
        )
    }
}

export default SearchHistory