var jwt = require('jsonwebtoken');
var auth_hdr = require('./auth_header');
var User = require('../app/models/User');

// ExpressJS convierte todos los headers a minúsculas
var AUTH_HEADER = "authorization",
    DEFAULT_AUTH_SCHEME = "JWT";

function extractJWTInHeader(request) {
  var token = null;

  if (request.headers[AUTH_HEADER]) {
    var auth_params = auth_hdr.parse(request.headers[AUTH_HEADER]);
    if (auth_params) {
      token = auth_params.value;
    }
  }

  return token;
};

module.exports = function(req, res, next) {
  var token = extractJWTInHeader(req);

  if (token == null) {
    return res.status(401).send("Unauthorized");
  }

  var decoded = jwt.decode(token, { complete: true });
  var payload = decoded.payload;
  var header = decoded.header;

  User.findOne({ email: payload.sub }).lean().exec(function(errFind, foundUser) {
    if (errFind) {
      return res.status(500).send("Internal server error");
    }

    if (foundUser) {
      // Verificamos si la firma del token es válida o no
      jwt.verify(token, foundUser.secret, function(errToken, decoded) {
        if (errToken) {
          return res.status(401).send("Unauthorized");
        }

        req.user = foundUser;
        return next();
      });
    } else {
      // No se encontró el usuario solicitado
      return res.status(401).send("Unauthorized");
    }
  });
};
