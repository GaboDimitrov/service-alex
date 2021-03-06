const Customer = require('../models/customer')

exports.add = function(req, res, next) {
    const { firstName, lastName, carNumber, selectedYear, phoneNumber } = req.body    
    const expiresDateInMilisecs = +new Date() + (365 * selectedYear) * 24 * 60 * 60 * 1000
    const expiresOn = removeHoursAndMinutesFromDate(expiresDateInMilisecs)

    Customer.find({ carNumber }, (err, existingCustomer) => {
        if (err) {
            return next(err)
        }

        if (existingCustomer.length > 0) {
            return res.status(422).send({error: "Car with this registration number exists"})
        }

        const customer = new Customer({
            firstName,
            lastName,
            carNumber,
            expiresOn,
            phoneNumber,
            selectedYear
        })

        customer.save(err => {
            if (err) {
                return next(err)
            }

            res.json({customer})
        })
    })
}

exports.findByDate = function(req, res, next) {
    const { date } = req.body
    Customer.find({

        //TODO: This should be fixed
        addedOn: {
            '$gte': date
        }
    }, (err, customers) => {
        if (err) {
            next(err)
        }

        res.json({customers})
    })
}

exports.findByCarNumber = function(req, res, next) {
    const {carNumber} = req.body

    Customer.find({
        carNumber: { "$regex": carNumber, "$options": 'i' }
    }, (err, customers) => {
        if (err) {
            console.log(err)
            next(err)
        }
        res.json({customers})
    })
}

exports.updatePhoneNumber = function(req, res) {
    const {carNumber, phoneNumber } = req.body

    Customer.findOne({
        carNumber: { "$regex": carNumber, "$options": 'i' }
    }, (err, customer) => {
        if (err) console.log(err)
        
        customer.phoneNumber = phoneNumber
        Customer.findByIdAndUpdate(customer._id, customer, null, (err, newCustomer) => {
            if (err) {
                console.log(err)
                next(err)
            }
            res.json({customer})
        })
        
    })
}

exports.update = function(req, res, next) {
    const { customer } = req.body
    const expiresDateInMilisecs = +new Date() + (365 * customer.selectedYear) * 24 * 60 * 60 * 1000
    const expiresOn = removeHoursAndMinutesFromDate(expiresDateInMilisecs)
    customer.expiresOn = expiresOn
    Customer.findByIdAndUpdate(customer._id, customer, null, (err, customer) => {
        if (err) {
            console.log(err)
            next(err)
        }
        res.json({customer})
    })
}

exports.getAllExpiringReviews = function (callback) {
    const oneWeekFromNowTime = +new Date() + 7 * 24 * 60 * 60 * 1000
    const strippedDate = removeHoursAndMinutesFromDate(oneWeekFromNowTime)
    const gteDate = new Date(strippedDate)
    const ltTime = strippedDate + (24 * 60 * 60 * 1000)
    const ltDate = new Date(ltTime)
    
    Customer.find({
        expiresOn: {"$gte": gteDate, "$lt": ltDate}
    }, (err, customers) => {
        if (err) {
            console.log(err)
            console.log('error')
            throw err
        }    
        console.log('asdasdasd')
        callback(customers, Customer)
    })
}

function removeHoursAndMinutesFromDate(dateTime) {
    const expiresOnDate = new Date(dateTime)
    expiresOnDate.setHours(0)
    expiresOnDate.setMinutes(0)
    expiresOnDate.setSeconds(0)
    expiresOnDate.setMilliseconds(0)
    return expiresOnDate.getTime()
}