import React, {Component} from 'react'
import {
    Button,
    Alert
} from 'react-bootstrap'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class CustomerFoundForm extends Component {
    constructor(props) {
        super(props)
        this.handleYearChange = this.handleYearChange.bind(this)
    }

    state = {
        expiresOnYear: this.props.customer.selectedYear
    }

    handleYearChange(event) {
        const { value } = event.target
        this.setState({ expiresOnYear: value })
    }

    async handleClick() {
        const { customer, clearDashboardForm } = this.props
        const { expiresOnYear } = this.state
        customer.selectedYear = expiresOnYear
        customer.notificationSent = false

        const response = await fetch('/updateCustomer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({customer})
        })

        if (response.status === 200) {
          clearDashboardForm()
          NotificationManager.success('Клиента е обновен', 'Успех', 3000)
        }
    }

    calculateSelectedYear(addedOn, expiresOn) {
        // +new Date() + (365 * selectedYear) * 24 * 60 * 60 * 1000
        let selectedYear = 1
        const addedOnDate = +new Date(addedOn)
        const expiresOnDate = (+new Date(expiresOn)).toString().substring(0, 5)
        const halfYear = (addedOnDate + (365 * 0.5) * 24 * 60 * 60 * 1000).toString().substring(0, 5)
        const oneYear = (addedOnDate + (365 * 1) * 24 * 60 * 60 * 1000).toString().substring(0, 5)
        const twoYears = (addedOnDate + (365 * 2) * 24 * 60 * 60 * 1000).toString().substring(0, 5)

        if ((halfYear + (365 * 0.5) * 24 * 60 * 60 * 1000) == expiresOnDate) {
            selectedYear = 0.5
        } else if (oneYear == expiresOnDate) {
            selectedYear = 1
        } else if (twoYears == expiresOnDate) {
            selectedYear = 2
        }
        return selectedYear
    } 
    render() {
        const { customer } = this.props
        const { expiresOnYear } = this.state
        const { firstName, lastName, addedOn, expiresOn, selectedYear, notificationSent } = customer
        const remainingDays = getRemainingDays(expiresOn)
        const remainingDaysClass = getRemainingDaysClass(remainingDays)
        const addedOnDate = new Date(addedOn).toLocaleDateString()
        const defaultYearSelected = selectedYear || this.calculateSelectedYear(addedOn, expiresOn)
        const yearSelected = (expiresOnYear || defaultYearSelected).toString()

        return(
            <React.Fragment>
                <h2>Намерен клиент</h2>
                <div>{firstName} {lastName}</div>
                <div>Добавен на:  <strong>{addedOnDate}</strong></div>
                <div>Изтича след: {remainingDays}<Alert bsStyle={remainingDaysClass}>
                    <strong>
                        {remainingDays}  {remainingDays > 0 ? 'дни': 'ден'}
                    </strong></Alert>
                </div>
                <div>
                    <label className="yearChange" >
                        <input 
                            type="radio" 
                            value="1" 
                            checked={yearSelected === '1'} 
                            onChange={this.handleYearChange}
                            className="year-input"
                        />
                        1 година
                    </label>
                    <label className="yearChange" >
                        <input 
                            type="radio" 
                            value="2" 
                            checked={yearSelected === '2'}
                            onChange={this.handleYearChange} 
                            className="year-input"
                        />
                        2 години
                    </label>
                    <label className="yearChange" >
                        <input 
                            type="radio" 
                            value="0.5" 
                            checked={yearSelected === '0.5'} 
                            onChange={this.handleYearChange} 
                            className="year-input"
                        />
                        половин година
                    </label>
                </div>

                <Button bsStyle="primary" onClick={() => {this.handleClick()}} disabled={!notificationSent} >Обнови преглед</Button>
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