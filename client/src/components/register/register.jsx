import React from 'react'

export default Register => {

    const onSubmit = async (e) => {
        e.preventDefault()
        const { target } = e
        const { username, password } = target
        await fetch('/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        })
    }
    return (
        <div>
            <form method="POST" action="/register" >
                <input type="text" placeholder="username" name="username"/>
                <input type="password" placeholder="password" name="password"/>
                <input type="submit" />
            </form>
        </div>
    )
}
