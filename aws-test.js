const AWS = require('aws-sdk')
const customerController = require('./controllers/customerController')
const AWS_CONFIG_OBJECT = {region: 'eu-west-1'}

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

if (process.env.SNS_KEY && process.env.SNS_SECRET) {
  AWS_CONFIG_OBJECT.accessKeyId = process.env.SNS_KEY
  AWS_CONFIG_OBJECT.secretAccessKey = process.env.SNS_SECRET
}
AWS.config.update(AWS_CONFIG_OBJECT)

customerController.getAllExpiringReviews((customers, Customer) => {
  customers.forEach(customer => {
    if (customer.notificationSent) {
      return
    }

    var params = {
      Message: `Здравейте!
      ПГТП "Alex" ви уведомява, че прегледа на автомобил с регистрационен номер ${customer.carNumber} изтича след 7 дни.`, /* required */
      PhoneNumber: `+359${customer.phoneNumber}`,
    };

    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise.then(
      function(data) {
        console.log("MessageID is " + data.MessageId);
        console.log(data);
        updateCustomer(customer, Customer)

      }).catch(
        function(err) {
        console.error(err, err.stack);
      });
  })

  return
})

const updateCustomer = (customer, Customer) => {
  customer.notificationSent = true
  Customer.findByIdAndUpdate(customer._id, customer, null, (err, customer) => {
    if (err) {
        console.log(err)
        next(err)
    }
  })
}