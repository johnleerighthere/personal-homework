import React from 'react'
import { Link } from 'react-router-dom'
import './SiteHeader.scss'

class SiteHeader extends React.Component {
    render() {
        return (
            <header id="site-header">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <h1>Dengue Heatmap</h1>


                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto">
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
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }

}

export default SiteHeader