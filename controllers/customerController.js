const Customer = require('../models/customer')

exports.add = function(req, res, next) {
    const { firstName, lastName, carNumber } = req.body

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
            carNumber
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

exports.update = function(req, res, next) {
    const { id } = req.body

    Customer.findByIdAndUpdate(id, {addedOn: new Date(), notificationSent: false}, null, (err, customer) => {
        if (err) {
            console.log(err)
            next(err)
        }


        res.json({customer})
    })
}

exports.getAllExpiringReviews = function () {
    const oneWeekFromNow = new Date() + 7 * 24 * 60 * 60 * 1000
    Customer.find({
        expiresOn: oneWeekFromNow
    }, (err, customers) => {
        if (err) {
            throw err
        }

        return customers
    })
}