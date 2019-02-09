import React from 'react'
import './header.css'
import { Grid, Row, Col } from 'react-bootstrap'

const Header = () => {

    return (
        <div className="header">
            <Grid>
                <Row>
                    <Col md={11}>
                        <div className="logo">
                            <h2><span className="logo_alex">Alex</span></h2>
                        </div>
                    </Col>
                </Row>

            </Grid>
        </div>
    )
}

export default Header