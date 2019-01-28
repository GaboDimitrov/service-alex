import React, {Component} from 'react'
import {
    Button,
    Alert
} from 'react-bootstrap'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class CustomerFoundForm extends Component {
    async handleClick() {
        const { customer, clearDashboardForm } = this.props
        const response = await fetch('/updateCustomer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: customer._id
            })
        })

        if (response.status === 200) {
          clearDashboardForm()
          NotificationManager.success('Клиента е обновен', 'Успех', 3000)
        }
    }
    render() {
        const { customer } = this.props
        const addedOn = new Date(customer.addedOn)
        const expiresOn = new Date(customer.expiresOn)
        const remainingDays = getRemainingDays(expiresOn)

        console.log(remainingDays)
        const remainingDaysClass = getRemainingDaysClass(remainingDays)
        console.log (remainingDaysClass)
        console.log (`remainingDaysClass`)
        return(
            <React.Fragment>
                <h2>Намерен клиент</h2>
                <div>{customer.firstName} {customer.lastName}</div>
                <div>Изтича след: <Alert bsStyle={remainingDaysClass}><strong>{remainingDays}  {remainingDays > 0 ? 'дни': 'ден'}</strong></Alert></div>
                <Button bsStyle="primary" onClick={() => {this.handleClick()}}>Обнови преглед</Button>
                <NotificationContainer/>
            </React.Fragment>
        )
    }
}

const getRemainingDays = expiresOn => {
    const timeDiff = Math.abs(expiresOn.getTime() - new Date().getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays
}

const getRemainingDaysClass = remainingDays => {
    if (remainingDays > 7 && remainingDays < 30) {
        return 'warning'
    }

    if (remainingDays > 30) {
        return 'success'
    }

    if (remainingDays < 7) {
        return 'error'
    }
}

export default CustomerFoundForm