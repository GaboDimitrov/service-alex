const express = require('express')
const authController = require('./controllers/authController')
const customerController = require('./controllers/customerController')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./services/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {session: false})
const requireSignIn = passport.authenticate('local', {session: false})
const app = express()
const path = require('path');
const port = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/service-alex')

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use(bodyParser.urlencoded());
app.use(bodyParser.json({type: '*/*'}));

// app.post('/register', (req, res, next) => {
//     const jwt = authController.register(req, res, next)
//     console.log(jwt)
// })

app.post('/login', requireSignIn, authController.login)

app.get('/getUser', requireAuth, authController.getUser)

app.post('/addCustomer', customerController.add)
app.post('/recentlyAdded', customerController.findByDate)
app.post('/findByCarNumber', customerController.findByCarNumber)
app.post('/updateCustomer', customerController.update)

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
  }

app.listen(port, () => {
    console.log(`server up and running on port ${port}`)
});