const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.login = function(req, res) {
    console.log(tokenForUser(req.user))
    res.send({ token: tokenForUser(req.user)})
}

const tokenForUser = user => {
    return jwt.sign({ sub: user.id }, config.secret, {expiresIn: '24h'})
}

exports.getUser = function(req, res) {
    res.json(req.user)
}

exports.register = function(req, res, next) {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(422).send({error: "Please provide name and password"})
    }

    User.find({ username }, (err, existingUser) => {
        if (err) {
            return next(err)
        }

        if (existingUser.length > 0) {
            return res.status(422).send({error: "Username exists"})
        }

        const user = new User({
            name: username,
            password
        })

        user.save(err => {
            if (err) {
                return next(err)
            }

            res.json({token: tokenForUser(user)})
        })
    })

}
