// var BearerStrxategy = require('passport-http-bearer');
var User = require('../app/models/User');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;


module.exports = function(passport) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: 'secrets'
    // issuer: 'accounts.jaque.me',
    // audience: 'example.com'
  };

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("Payload:" + JSON.stringify(jwt_payload));

    User.findOne({ _id: jwt_payload.sub }, function(errSearch, user) {
      if (errSearch) {
        return done(errSearch);
      }

      console.log("Usuario en passport: " + user);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
};
