var BearerStrategy = require('passport-http-bearer');
var User = require('../app/models/User');

module.exports = function(passport) {
  passport.use(new BearerStrategy(function(token, done) {
    User.findOne({ token: token }, function(errSearch, user) {
      if (errSearch) {
        return done(errSearch);
      }

      if (!user) return done(null, false);
      return done(null, user, { "scope": "all" });
    });
  }));
};
