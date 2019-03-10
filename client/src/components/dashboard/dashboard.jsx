import React, { Component } from 'react'
import {
    FormControl,
    FormGroup,
    HelpBlock,
    Button,
    Panel,
    ControlLabel,
    Row,
    Col,
    DropdownButton,
    MenuItem,
    ListGroup,
    InputGroup,
    ListGroupItem
} from 'react-bootstrap'
import './dashboard.css'
import CustomerFoundForm from './CustomerFoundForm'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const CAR_REGEX = /(^[ABEKMHOPCTYX]{1,2})\d{4}([ABEKMHOPCTYX]{1,2}$)/
const PHONE_REGEX = /8[789]\d{7}/
const NAME_ERROR_VALUE = 'Името не може да е празно'

class Dashboard extends Component {
    constructor(props){
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
        this.searchCustomer = this.searchCustomer.bind(this)
        this.getAddFormValidationState = this.getAddFormValidationState.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.clearForm = this.clearForm.bind(this)
        this.dashboardForm = React.createRef()
    }

    state = {
        carNumber: null,
        firstName: '',
        lastName: '',
        phoneNumber: null,
        carNumberError: null,
        nameError: null,
        phoneNumberError: null,
        addCustomerForm: {
        },
        editCustomerForm: {
        },
        dropdownTitle: "Избери преди",
        customers: null,
        searchedCustomers: null
    }

    async handleSubmit(event) {
        event.preventDefault()
        //TODO: add validation
        const { firstName, lastName, carNumber, phoneNumber } = this.state

        if (!firstName || !lastName) {
            this.setState({nameError: NAME_ERROR_VALUE})
            return
        }

        if (!phoneNumber) {
            this.setState({phoneError: 'въведете телефонен номер'})
            return
        }

        if (!PHONE_REGEX.test(phoneNumber)) {
            this.setState({phoneError: 'грешен телефонен номер'})
            return
        }

        const response = await fetch('/addCustomer', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstName,
                lastName,
                carNumber,
                phoneNumber
            })
        })

        if (response.status === 200) {
            NotificationManager.success('Клиента е добавен', 'Успех', 3000)
            this.clearForm()
        }
    }

    clearForm() {
        this.dashboardForm.current.reset()
        this.setState({ 
            carNumber: null, 
            searchedCustomers: null,
            firstName: '',
            lastName: '',
            phoneNumber: null 
        })
    }

    mapEventToDate(event) {
        let currentDate = new Date()
        switch (event) {
            case '1': {
                const pastDate = currentDate.getDate() - 7;
                currentDate.setDate(pastDate)
                break
            }
            case '2': {
                const pastDate = currentDate.getDate() - 31;
                currentDate.setDate(pastDate)
                break
            }

            case '3': {
                const pastDate = currentDate.getDate() - 93;
                currentDate.setDate(pastDate)
                break
            }

            case '4': {
                const pastDate = currentDate.getDate() - 366;
                currentDate.setDate(pastDate)
                break
            }
            default:
                break
        }

        return currentDate
    }

    async handleSelect(event, eventKey){
        this.setState( {dropdownTitle: eventKey.currentTarget.innerText} )

        const date = this.mapEventToDate(event)
        const response = await fetch('/recentlyAdded',{
            method: 'POST',
            body: JSON.stringify({
               date
            })
        })

        if (response.status === 200) {
            const responseBody = await response.json()
            const { customers } = responseBody
            this.setState({customers})
        }
    }

    async searchCustomer(event) {
        //This will search for customers on typing. If custoemer exists, it will show it, otherwise it will display the rest of the form
        const carNumber = event.target.value
        let searchedCustomers
        const isNumberValid = CAR_REGEX.test(carNumber)
        const carNumberError = isNumberValid ? '' : 'Грешен регистрационен номер'

        const response = await fetch('/findByCarNumber', {
            method: 'POST',
            body: JSON.stringify({carNumber})
        })

        if (response.status === 200) {
            const responseBody = await response.json()
            const { customers } = responseBody

            searchedCustomers = customers
        }

        this.setState({searchedCustomers, carNumber, carNumberError})
    }

    getAddFormValidationState() {
        const { carNumber } = this.state
        if (carNumber) {
            const isNumberValid = CAR_REGEX.test(carNumber)
            return isNumberValid ? 'success': 'error'
        }

        return null
    }

    getFirstNameValidationState() {
        const { nameError, firstName } = this.state

        if (firstName.length === 0 && nameError === null) {
            return 'error'
        } 

        return 'success'
    }

    getLastNameValidationState() {
        const { lastName, nameError } = this.state
        if (lastName.length === 0 && nameError === null) {
            return 'error'
        }

        return `success`
    }

    getPhoneNumberValidationState() {
        const { phoneNumber } = this.state
        if (phoneNumber && !PHONE_REGEX.test(phoneNumber)) return 'error'
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    handlePhoneChange(e) {
        const isPhoneValid = PHONE_REGEX.test(e.target.value)
        const stateObj = {
            phoneNumber: e.target.value, 
            phoneNumberError: isPhoneValid ? '': 'грешен телефонен номер'
        }
        this.setState(stateObj)
    }

    displayAddform() {
        const { nameError, phoneNumberError } = this.state
        return (
            <React.Fragment>
                <FormGroup
                    controlId="firstName"
                    required
                    validationState={this.getFirstNameValidationState()}
                >
                    <ControlLabel>Първо име</ControlLabel>
                    <FormControl required type="text" placeholder="Въведете първо име" name="firstName" onChange={this.handleChange}/>
                    <FormControl.Feedback />
                    <HelpBlock>{nameError}</HelpBlock>
                </FormGroup>

                <FormGroup
                    controlId="lastName"
                    validationState={this.getLastNameValidationState()}
                >
                    <ControlLabel>Фамилия</ControlLabel>
                    <FormControl type="text" placeholder="Въведете фамилия" name="lastName" onChange={this.handleChange}/>
                    <FormControl.Feedback />
                    <HelpBlock>{nameError}</HelpBlock>
                </FormGroup>
                <FormGroup
                    controlId="phoneNumber"
                    validationState={this.getPhoneNumberValidationState()}
                >
                    <ControlLabel>Телефонен номер</ControlLabel>
                    <InputGroup>
                        <InputGroup.Addon>+359</InputGroup.Addon>
                        <FormControl type="text" placeholder="Въведете Телефон" name="lastName" onChange={this.handlePhoneChange}/>
                    </InputGroup>
                        <FormControl.Feedback />
                        <HelpBlock>{phoneNumberError}</HelpBlock>
                </FormGroup>
                <Button type="submit" bsStyle="primary">Добави</Button>
            </React.Fragment>
        )
    }

    render() {
        const { dropdownTitle, customers, carNumberError, carNumber, searchedCustomers } = this.state
        const shouldDisplayAddForm = searchedCustomers && searchedCustomers.length === 0 && carNumber && carNumberError.length === 0
        const shouldDisplayViewForm = searchedCustomers && searchedCustomers.length > 0 && !carNumberError && carNumber

        return (
            <Row className={`show-grid dashboard`}>
                <Col md={5}>
                    <Panel bsStyle="info">
                        <Panel.Heading>
                        <Panel.Title componentClass="h3">Добави/Намери клиент</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                        <form method="POST" action="/addCustomer" onSubmit={this.handleSubmit} ref={this.dashboardForm}>
                            <FormGroup
                                controlId="addCustomer"
                                validationState={this.getAddFormValidationState()}
                            >
                                <ControlLabel>Регистрационен номер</ControlLabel>
                                <FormControl required type="text" placeholder="Въведете регистрационен номер" name="carNumber" onChange={this.searchCustomer}/>
                                <FormControl.Feedback />
                                <HelpBlock>{carNumberError}</HelpBlock>
                            </FormGroup>
                                {shouldDisplayAddForm ? this.displayAddform() : null}
                                {shouldDisplayViewForm ? <CustomerFoundForm customer={searchedCustomers[0]} clearDashboardForm={this.clearForm} /> : null}
                    </form>
                        </Panel.Body>
                    </Panel>
                    </Col>

                    <Col mdOffset={1} md={5}>
                    <Panel bsStyle="info">
                        <Panel.Heading>
                        <Panel.Title componentClass="h3">Наскоро добавени</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <DropdownButton
                                title={dropdownTitle}
                                id="recently-added"
                                onSelect={this.handleSelect}
                                key={2}
                                >
                                <MenuItem eventKey="1">1 Седмица</MenuItem>
                                <MenuItem eventKey="2">1 Месец</MenuItem>
                                <MenuItem eventKey="3">3 Месеца</MenuItem>
                                <MenuItem eventKey="4">1 Година</MenuItem>
                            </DropdownButton>

                            {customers ? (

                                <ListGroup>
                                    {customers.map(customer => {

                                const date = new Date(customer.addedOn)
                                return (
                                    <ListGroupItem>{customer.firstName} - {date.toLocaleDateString('bg-BG')}</ListGroupItem>
                                )
                            })}
                                </ListGroup>
                            ) : <h2>Избери дата</h2>}
                        </Panel.Body>
                    </Panel>
                </Col>
                <NotificationContainer />
            </Row>
        )
    }
}

export default Dashboard