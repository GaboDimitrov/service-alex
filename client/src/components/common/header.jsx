import React from 'react'
import styles from './header.css'
import { Grid, Row, Col } from 'react-bootstrap'

const Header = () => {

    return (
        <div className={styles.header}>
            <Grid>
                <Row>
                    <Col md={11}>
                        <div className={styles.logo}>
                            <h2><span className={styles.logo_alex}>Alex</span></h2>
                        </div>
                    </Col>
                </Row>

            </Grid>
        </div>
    )
}

export default Header