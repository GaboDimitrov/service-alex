const express = require('express')
const aws = require('./aws-test')
const cron = require('node-cron')
const authController = require('./controllers/authController')
const customerController = require('./controllers/customerController')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./services/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {session: false})
const requireSignIn = passport.authenticate('local', {session: false})
const app = express()
const port = process.env.PORT || 5000
const mongoURL = process.env.MONGODB_URI ||'mongodb://localhost/service-alex'

mongoose.connect('mongodb://heroku_s5x31l43:3a70hkbvqlbcsmpjvr8mvu03s8@ds129085.mlab.com:29085/heroku_s5x31l43')
// mongoose.connect(mongoURL)

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

cron.schedule('0 11 * * *', () => {
    aws()
}, {
    timezone: 'Europe/Sofia'
})
app.listen(port, () => {
    console.log(`server up and running on port ${port}`)
});