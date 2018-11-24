import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getJWT, removeJWT } from '../../helpers/jwt'

class AuthenticatedComponent extends Component {
    state = {
        user: null
    }

    componentDidMount() {
        const { history } = this.props
        const jwt = getJWT()

        if (!jwt) {
            history.push('/')
            return
        }

        fetch('/getUser', {
            method: "GET",
            headers: {
                'authorization': `Bearer ${jwt}`
            }
        }).then((response) => {
            return response.json()
        })
        .then(response => {
            this.setState({user: response})
        })
        .catch(err => {
            console.log(err)
            removeJWT()
            history.push('/')
        })
    }

    render() {
        if (!this.state.user) {
            return (
                <h1>Loading...</h1>
            )
        }

        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default withRouter(AuthenticatedComponent)