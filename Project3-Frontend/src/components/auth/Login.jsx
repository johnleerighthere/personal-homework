import React from 'react'
import moment from 'moment'
import { withCookies } from 'react-cookie'
import { withRouter, Link } from 'react-router-dom'
import apiService from '../../services/ApiService'
import toastr from 'toastr'
import '../auth/Login.scss'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            formErr: '',
        }
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value
        })
    }

    handlePasswrdChange(e) {
        this.setState({
            password: e.target.value
        })
    }

    handleFormSubmission(e) {
        e.preventDefault()

        // Verify email and password is not null
        if (this.state.email === "" || this.state.password === "") {
            this.setState({
                formErr: "Email and Password must not be empty"
            })
            return
        }

        // make api call to login
        apiService.login(this.state.email, this.state.password)
            .then(response => {
                if (!response.data.success) {
                    this.setState({
                        formErr: "Error occurred in form, please check values"
                    })

                    // Return if response.data.success is false! This is to avoid continueing execute the following lines of code
                    // this will set a cookie "token" with value as undefined
                    return
                }

                toastr.success(response.data.message)

                this.props.cookies.set('token', response.data.token, {
                    path: '/',
                    expires: moment.unix(response.data.expiresAt).toDate()
                })

                window.localStorage.setItem("userObj", JSON.stringify(response.data.userDetails))

                window.location.href = "/"
            })
            .catch(err => {
                this.setState({
                    formErr: "Error occurred in form, please check values"
                })
            })
    }


    render() {
        return (
            <div className="page-login">
                <div className="container">
                    <form className="mt-5 mb-5 form col-lg-5" onSubmit={e => { this.handleFormSubmission(e) }}>
                        <div className="form-title">
                            <h4>Sign In</h4>
                        </div>
                        <div className="form-group">
                            <label htmlFor="InputEmail">Email address</label>
                            <input type="email" onChange={e => { this.handleEmailChange(e) }} className="form-control" id="InputEmail" value={this.state.email} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="InputPassword1">Password</label>
                            <input type="password" onChange={e => { this.handlePasswrdChange(e) }} className="form-control" id="InputPassword" />
                        </div>
                        {
                            this.state.formErr !== "" ? (
                                <div className="form-error">
                                    <p>{this.state.formErr}</p>
                                </div>
                            ) : (
                                    ""
                                )
                        }
                        <div className="form-button">
                            <span className="create">
                                <Link to="/users/register" >
                                    Create Account
                                        </Link>
                            </span>

                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}


export default withRouter(withCookies(Login))