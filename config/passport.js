const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');
const _ = require('lodash');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwtSecret;

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User
                .findById(jwt_payload.id)
                .then((user) => {
                    if (user) return done(null, _.pick(user, ['id', 'name', 'email']));
                    else return done(null, false);
                })
                .catch(err => console.log(err));

        })
    );
}