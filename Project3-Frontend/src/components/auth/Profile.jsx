import React from 'react'
import Ajv from 'ajv'
import { Link, Redirect } from 'react-router-dom'
import apiService from '../../services/ApiService'
import registrationFormValidationSchema from '../../validation-schemas/registration-form'
import '../auth/Register.scss'
import { getAuthenticated } from "../helpers/utility"
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import toastr from 'toastr'

const ajv = new Ajv({ allErrors: true })

class Profile extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: getAuthenticated(),
            name: '',
            currentEmail: '',
            email: '',
            address: '',
            phone: '',
            formMsg: [],
            formErr: '',
            redirect: false,
        }
    }

    async getTokens() {
        if (this.state.loggedIn) {
            let userObj = JSON.parse(localStorage.getItem("userObj"))

            this.setState({
                name: userObj.name,
                currentEmail: userObj.email,
                email: userObj.email,
                address: userObj.location,
                phone: userObj.number
            })
        }
    }

    handleInputChange(e) {
        const state = {}
        state[e.target.name] = e.target.value
        this.setState(state)
    }

    handleChange = address => {
        this.setState({ address });
    }

    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => {
                const address = results[0].formatted_address
                this.setState({ address })
            })
    }

    handleFormSubmission(e) {
        e.preventDefault()

        // clear form inputs
        this.setState({
            formMsg: [],
            formErr: ''
        })

        // Send all the Form inputs for validation
        const formValid = this.validateFormInputs()

        if (formValid) {
            // Send form inputs to backend via API and create user account in Database
            const formInputs = this.state

            apiService.updateUserProfile(formInputs)
                .then(response => {

                    if (!response.data.success) {
                        this.setState({
                            formErr: "Error occurred in form, please check values"
                        })
                        return
                    }

                    if (response.data.success) {
                        toastr.success("Profile updated successfully")
                        this.setState({ redirect: true })
                    }

                    // clear form input
                    this.setState({
                        name: '',
                        email: '',
                        address: '',
                        phone: ''
                    })

                })
                .catch(err => {
                    console.log(err)
                })

        }


    }

    validateFormInputs() {
        const err = []
        const formValid = ajv.validate(registrationFormValidationSchema, this.state)

        if (!formValid) {
            ajv.errors.forEach(element => {
                let field = element.dataPath.toUpperCase()
                err.push(`${field} field ${element.message}`)
            })
        }

        if (err.length === 0) {
            return true
        }

        this.setState({
            formMsg: err
        })

        return false
    }

    componentDidMount() {
        this.getTokens()
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/users/login' />;
        }

        return (
            <div className="page-registration">
                <div className="container">
                    <form className="mt-5 mb-5 form col-lg-8" onSubmit={e => { this.handleFormSubmission(e) }}>
                        {
                            this.state.formMsg.length > 0 ?
                                (
                                    <ul className="form-messages text-left" >
                                        {
                                            this.state.formMsg.map(msg => {
                                                return (
                                                    <li>{msg.replace(/[&\\#,+()$~%.'":*?<>{}]/g, '')}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                ) : ''
                        }
                        <div className="form-title">
                            <h4>User Profile</h4>
                            <span>to edit your personal information</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control form-control-lg" name="name" value={this.state.name} onChange={e => { this.handleInputChange(e) }} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control form-control-lg" name="email" value={this.state.email} onChange={e => { this.handleInputChange(e) }} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <PlacesAutocomplete
                                value={this.state.address}
                                onChange={this.handleChange}
                                onSelect={this.handleSelect}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <input
                                            {...getInputProps({
                                                className: 'form-control form-control-lg',
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
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' }

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
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>

                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone No.</label>
                            <input type="text" className="form-control form-control-lg" name="phone" value={this.state.phone} onChange={e => { this.handleInputChange(e) }} />

                        </div>

                        <div className="form-button">
                            <p className="formError" ></p>

                            <span className="create">
                                <Link to="/" >
                                    Cancel
                            </Link>
                            </span>

                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}

export default Profile