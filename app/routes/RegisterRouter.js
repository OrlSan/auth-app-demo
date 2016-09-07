var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.post('/new', function(req, res) {
  // Vamos a pedir:
  // 1. name
  // 2. email
  // 3. password
  // 4. age
  var body = req.body;
  if (body.name == "" || body.email == "" || body.password == "" || body.age == "") {
    return res.json({ success: false, message: "Se esperaban parámetros: name, email, password, age"});
  }

  User.findOne({ email: body.email }, function(errSearch, existingUser) {
    if (errSearch) return res.json({ success: false, message: "Error en BD" });

    if (existingUser) return res.json({ success: false, message: "Usuario ya registrado" });

    User.generateHash(body.password, function(errHash, hash) {
      if (errHash) return res.json({ success: false, message: "Error en Hash" });

      // Guardamos el usuario
      var newUser = new User({
        email: body.email,
        password: hash,
        name: body.name,
        age: body.age
      });

      newUser.save(function(saveErr, user) {
        if (saveErr) {
          if (saveErr) return res.json({ success: false, message: "No se pudo guardar" });
        } else {
          return res.json({ success: true, sub: user._id });
        }
      });
    });
  });
});

module.exports = router;
