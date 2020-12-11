import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import ProtectedRoute from './components/ProtectedRoute'
import 'bootstrap/scss/bootstrap.scss'
import './App.scss';
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import Home from './components/pages/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Profile from './components/auth/Profile'

// import SearchBar from './components/SearchBar'
// import SearchHistory from './components/SearchHistory'

class App extends React.Component {
  renderLocation = (routerProps) => {
    console.log(routerProps);
  }

  render() {
    return (
      <div className="App">
        <Router>
          <SiteHeader />

          <Switch>
            <GuestRoute path="/users/login" component={Login} />
            <GuestRoute path="/users/register" component={Register} />
            <ProtectedRoute path="/users/profile" component={Profile} />

            <Route exact path="/">
              <Home />
            </Route>
            {/* <Route exact path="/map/location/:address"
              render={routerProps => this.renderLocation(routerProps)}>
            </Route> */}
          </Switch>

          <SiteFooter />
        </Router>

      </div>
    )

  }
}

export default App;
