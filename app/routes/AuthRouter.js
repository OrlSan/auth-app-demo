var express = require('express');
var router = express.Router();
var uuid = require('uuid');

// El modelo de usuario
var User = require('../models/User');

router.get('/', function(req, res) {
  res.json({ success: false, message: "GET not allowed" });
});

router.post('/', function(req, res) {
  User.findOne({ "email": req.body.email }, function(errFind, user) {
    if (errFind) {
      console.log("Error al buscar el usuario en la base de datos: " + errFind);
      return res.json({ success: false, message: "Error en la base de datos" });
    }

    if (!user) {
      return res.json({ success: false, message: "No existe el usuario con el correo electrónico " + req.body.email });
    }

    user.checkPassword(req.body.password, function(errPass, valid) {
      if (errPass) {
        console.log("Error al comparar el password: " + errPass);
        return res.json({ success: false, message: "Error en la contraseña" });
      }

      if (valid) {
        // Emitir un Token y guardarlo en el usuario, y luego lo regresamos en
        // la respuesta de la petición
        user.token = uuid.v4();

        user.save(function(saveErr) {
          if (saveErr) {
            return res.json({ success: false, message: "Internal DB error" });
          }

          return res.json({ success: true, token: user.token });
        });
      } else {
        return res.json({ success: false, message: "La contraseña no es válida" });
      }
    });
  });
});

// Exportamos el Router para usarlo en la aplicación
module.exports = router;
