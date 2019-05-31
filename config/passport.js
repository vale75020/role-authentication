const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require ('../models/User');
const config = require('../config/database');

// To athenticate the User by JWT Strategy
module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt'); //extract jwt from header
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
        User.getUserById(jwt_payload.data._id, (err, user) => {
            if(err) return done(err, false);
            if(user) return done(null, user);
            return done(null, false);
        });
    }));
}