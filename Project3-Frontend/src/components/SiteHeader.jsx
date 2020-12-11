import React from 'react'
import { Link } from 'react-router-dom'
import './SiteHeader.scss'
import { getAuthenticated, showToastMessage } from "./helpers/utility";

class SiteHeader extends React.Component {

    state = {
        loggedIn: getAuthenticated()
    }


    componentWillReceiveProps() {
        console.log("in header again")
    }

    loggedOut = () => {
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // showToastMessage("success", "Logout Successfully")
        window.localStorage.clear()
        window.location.href = "/users/login"


    }

    render() {
        console.log(this.state.loggedIn)
        return (
            <header id="site-header">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <h1>Dengue Heatmap</h1>


                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto">
                                {!this.state.loggedIn &&
                                    <>
                                        <li className="nav-item">
                                            <Link to="/" className="nav-link" >
                                                Home
                                    </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/users/login" className="nav-link" >
                                                Login
                                    </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/users/register" className="nav-link" >
                                                Register
                                    </Link>
                                        </li>
                                    </>
                                }
                                {this.state.loggedIn && <li className="nav-item" onClick={() => this.loggedOut()}>
                                    {/* <Link to="/" className="nav-link" >
                                            Register
                                    </Link> */}
                                    <a href="" className="nav-link" >Logout</a>

                                </li>}

                                {this.state.loggedIn && <li className="nav-item">
                                    <Link to="/users/profile" className="nav-link" >
                                        Profile
                                    </Link>
                                </li>}
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }

}

export default SiteHeader