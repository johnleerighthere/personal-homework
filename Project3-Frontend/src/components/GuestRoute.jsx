import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { withCookies } from 'react-cookie'
import { getAuthenticated } from "./helpers/utility"

class GuestRoute extends React.Component {
    // isAuthenticated will check if user is logged in or not
    // isAuthenticated() {
    //     const token = this.props.cookies.get('token')

    //     // checks if token evaluates to false
    //     // - token === undefined
    //     // - token === null
    //     // - token === ""
    //     if (!token || token === "undefined" || token === "null") {
    //         return false
    //     }
    //     return true
    // }

    render() {
        const Comp = this.props.component
        console.log(getAuthenticated())
        return (
            getAuthenticated() ? (
                <Redirect to="/" />
            ) : (
                    <Comp />
                )
        )

    }
}

export default withCookies(withRouter(GuestRoute))