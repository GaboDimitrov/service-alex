const AWS = require('aws-sdk')

module.exports = function() {
    AWS.config.update( {region: 'eu-west-1'} )
    const today = new Date()
    const nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    var params = {
        Message: 'я да видимasdas', /* required */
        PhoneNumber: '+359894625264',
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
}