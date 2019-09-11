import React, {useState} from 'react'

export default UpdatePhone => {

    const [user, setUser] = useState([])
    const onSubmit = async event => {
        event.preventDefault();
        const { carNumber, phoneNumber } = event.target

        const response = await fetch('/updatePhone', {
            method: 'post',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                carNumber: carNumber.value,
                phoneNumber: phoneNumber.value
            })
        })

        if (response.status === 200) {
            const responseBody = await response.json()
            const { customer } = responseBody
            
            console.log(customer)
            setUser([customer])

        }
    }

    return (
        <div>
            <form method="POST" onSubmit={e => {onSubmit(e)}}>
                <input type="text" placeholder="car Number" name="carNumber"/>
                <input type="password" placeholder="Phone number" name="phoneNumber"/>
                <input type="submit" />
                {user.map( (u, key) => <div key={key}>{u.firstName} {u.lastName} : {u.carNumber} - {u.phoneNumber}</div>)}
            </form>
        </div>
    )
}