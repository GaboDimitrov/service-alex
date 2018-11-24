import React from 'react'
import { FormControl, FormGroup, Col} from 'react-bootstrap'


export default function Login (props) {
    const onSubmit = async (e) => {
        e.preventDefault()
        const { target } = e
        const { name, password } = target
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
        <Col md={12}>
            <h2>Вход</h2>
            <form action="/login" method="POST" onSubmit={(e) => {onSubmit(e)}}>
                <FormGroup
                    controlId="loginForm"
                >
                    <FormControl type="text" placeholder="Име" name="name" className='form-input' />
                    <FormControl type="password" placeholder="Парола" name="password" className='form-input'/>
                    <FormControl type="submit" value="Изпрати"/>
                </FormGroup>
            </form>
        </Col>
    )
}