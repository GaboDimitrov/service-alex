import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './components/login/login.jsx'
import Home from './components/home/home'
import Header from './components/common/header.jsx'
import AuthenticatedComponent from './components/common/authentiactedComponent'
import Register from './components/register/register.jsx'
import Dashboard from './components/dashboard/dashboard.jsx'
import { Grid, Row } from 'react-bootstrap'

const Error = () => {
  return <div>404 Not Found </div>
}


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <Grid>
          <Row className="show-grid">
          <Switch>
            <Route path="/" component={Login} exact />
            <Route path="/register" component={Register} />
            <Route path="/home" component={Home} />
            <AuthenticatedComponent>
              <Route path="/dashboard" component={Dashboard} />
            </AuthenticatedComponent>
            <Route component={Error}/>
          </Switch>
        </Row>
      </Grid>
    </BrowserRouter>
  )
  }
}

export default App;
