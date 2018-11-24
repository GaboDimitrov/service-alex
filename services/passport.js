const passport = require('passport')
const User = require('../models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const config = require('../config')
const localOptions = {

    // TODO: this might be changed to usernme
    usernameField: 'name'
}

const localLogin = new LocalStrategy(localOptions, (name, password, done) => {
    console.log('PASSPORT')
    console.log(name)
    console.log(password)
    User.findOne({name}, (err, user) => {
        console.log('HERE')
        if (err) {
            console.log('err 1')
            console.log(err)
            return done(err)
        }

        if (!user) {
            console.log('HERE???')
            return done(null, false)
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                console.log('err 2')
                console.log(err)

                console.log(err)
                return done(err)
            }

            if (!isMatch) {
                return done(null, false)
            }

            return done(null, user)
        })
    })
})

const jtwOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: config.secret
}

const jwtLogin = new JwtStrategy(jtwOptions, function(payload, done) {
    User.findById(payload.sub, (err, user) => {
        if (err) {
            return done(err, false)
        }

        if (user) {
            done(null, user)
        }
    })
})

passport.use(jwtLogin)
passport.use(localLogin)