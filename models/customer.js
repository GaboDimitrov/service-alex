const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    carNumber: { type: String, unique: true },
    addedOn: { type : Date, default: Date.now },
    phoneNumber: { type: String },

    // default is one year from now
    expiresOn: { type : Date, default: +new Date() + 365 * 24 * 60 * 60 * 1000 },
    notificationSent: {type: Boolean, default: false }
})

const customerClass = mongoose.model('customer', customerSchema)

module.exports = customerClass
