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
        const { firstName, lastName, addedOn, expiresOn } = customer
        const remainingDays = getRemainingDays(expiresOn)
        const remainingDaysClass = getRemainingDaysClass(remainingDays)
        const addedOnDate = new Date(addedOn).toLocaleDateString()

        return(
            <React.Fragment>
                <h2>Намерен клиент</h2>
                <div>{firstName} {lastName}</div>
                <div>Добавен на:  <strong>{addedOnDate}</strong></div>
                <div>Изтича след: {remainingDays}<Alert bsStyle={remainingDaysClass}>
                    <strong>
                        {remainingDays}  {remainingDays > 0 ? 'дни': 'ден'}
                    </strong></Alert></div>
                <Button bsStyle="primary" onClick={() => {this.handleClick()}}>Обнови преглед</Button>
                <NotificationContainer/>
            </React.Fragment>
        )
    }
}

const getRemainingDays = expiresOn => {
    const expirationDate = new Date(expiresOn)
    const timeDiff = Math.abs(expirationDate.getTime() - new Date().getTime());
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