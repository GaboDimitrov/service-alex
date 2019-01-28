import React from 'react'
import styles from './login.css'
import { FormControl, ControlLabel, Panel, Col, Row, Button} from 'react-bootstrap'


export default function Login (props) {
    const onSubmit = async (e) => {
        e.preventDefault()
        const { target } = e
        const { name, password } = target

        console.log(name, password)
        const response = await fetch('/login', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: name.value,
                password: password.value
            })
        })
        if (response.status === 200) {
            const responseBody = await response.json()
            const { token } = responseBody
            localStorage.setItem('userToken', token)

            // redirect
            props.history.push('/dashboard')
        }
    }

    return (
            <React.Fragment>
                <div className={styles.login_background}></div>
                <Row className={`show-grid ${styles.center}`}>
                    <Col mdOffset={4} md={5}>
                        <Panel>
                            <Panel.Heading>
                            <Panel.Title componentClass="h3">Вход</Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <form action="/login" method="POST" onSubmit={(e) => {onSubmit(e)}}>
                                    <ControlLabel>Име</ControlLabel>
                                    <FormControl type="text" placeholder="Въведете име" name="name"/>
                                    <ControlLabel>Парола</ControlLabel>
                                    <FormControl type="password" placeholder="Въведете парола" name="password"/>
                                    <Button type="submit" bsStyle="primary">Изпрати</Button>
                                </form>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </React.Fragment>
    )
}