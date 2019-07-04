const AWS = require('aws-sdk')
const customerController = require('./controllers/customerController')
module.exports = function() {
    AWS.config.update( {region: 'eu-west-1'} )

    customerController.getAllExpiringReviews(customers => {
      customers.forEach(customer => {
        var params = {
          Message: `Здравейте, от сервиз алекс искаме да ви съобщим, че прегледа на автомобил с регистрационен номер ${customer.carNumber} изтича след 7 дни.`, /* required */
          PhoneNumber: `+359${customer.PhoneNumber}`,
        };
        // Create promise and SNS service object
        var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
  
        // Handle promise's fulfilled/rejected states
        publishTextPromise.then(
          function(data) {
            console.log("MessageID is " + data.MessageId);
            console.log(data);
          }).catch(
            function(err) {
            console.error(err, err.stack);
          });
      })
    })
}