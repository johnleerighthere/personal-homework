import React from 'react'
import { Link } from 'react-router-dom'
import Ajv from 'ajv'
import apiService from '../../services/ApiService'
import registrationFormValidationSchema from '../../validation-schemas/registration-form'
import { geocodeByAddress } from 'react-places-autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';
import '../auth/Register.scss'

const ajv = new Ajv({ allErrors: true })

class Registration extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            address: '',
            phone: '',
            formMsg: []
        }
    }

    handleInputChange(e) {
        const state = {}
        state[e.target.name] = e.target.value
        this.setState(state)
    }

    handleChange = address => {
        this.setState({ address });
    };

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
            formMsg: []
        })

        // Send all the Form inputs for validation
        const formValid = this.validateFormInputs()

        if (formValid) {
            // Send form inputs to backend via API and create user account in Database
            const formInputs = this.state

            apiService.sendRegistrationForm(formInputs)
                .then(response => {

                    if (!response.data.success) {
                        this.setState({
                            formErr: "Error occurred in form, please check values"
                        })
                        return
                    }
                    // clear form input
                    this.setState({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        address: '',
                        phone: ''
                    })
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }


    validateFormInputs() {
        const err = []
        const formValid = ajv.validate(registrationFormValidationSchema, this.state)

        if (this.state.password !== this.state.confirmPassword) {
            err.push("Passwords not match")
        }

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


    render() {
        return (
            <div className="page-registration">
                <div className="container">
                    <form className="mt-5 mb-5 form col-lg-8" onSubmit={e => { this.handleFormSubmission(e) }} >
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
                            <h4>Create an Account</h4>
                            <span>to continue with notifications and others</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control form-control-lg" name="name" value={this.state.name} onChange={e => { this.handleInputChange(e) }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control form-control-lg" name="email" value={this.state.email} onChange={e => { this.handleInputChange(e) }} />
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control form-control-lg" name="password" value={this.state.password} placeholder="Min. 5" onChange={e => { this.handleInputChange(e) }} />
                            </div>

                            <div className="form-group col-md-6">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input type="password" className="form-control form-control-lg" name="confirmPassword" value={this.state.confirmPassword} onChange={e => { this.handleInputChange(e) }} />
                            </div>
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
                                                placeholder: 'Type Address....',
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
                            <span className="create">
                                <Link to="/users/login" >
                                    Sign In Instead
                                </Link>
                            </span>

                            <button type="submit" className="btn btn-primary">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}

export default Registration