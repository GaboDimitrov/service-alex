import React from 'react'
import { NavLink } from 'react-router-dom'
import './header.css'
import { Grid, Row, Col } from 'react-bootstrap'

const Header = () => {

    return (
        <div className='header'>
            <Grid>
                <Row>
                    <Col md={14}>
                        <div className="logo">
                            <h2>Service <span className="logo-alex">Alex</span></h2>
                        </div>
                        <NavLink to="/home">Home</NavLink>
                        <NavLink to="/">Home</NavLink>
                    </Col>
                </Row>

            </Grid>
        </div>
    )
}

export default Header