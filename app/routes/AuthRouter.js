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
      return res.status(500).json({
        success: false,
        message: "Error en la base de datos"
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No existe el usuario con el email " + req.body.email
      });
    }

    user.checkPassword(req.body.password, function(errPass, valid) {
      if (errPass) {
        console.log("Error al comparar el password: " + errPass);
        return res.status(500).json({
          success: false,
          message: "Error interno del servidor. Problema con la contraseña"
        });
      }

      if (valid) {
        // Emitir un Token y guardarlo en el usuario, y luego lo regresamos en
        // la respuesta de la petición
        user.secret = uuid.v4();

        user.save(function(saveErr) {
          if (saveErr) {
            return res.status(500).json({
              success: false,
              message: "Internal DB error"
            });
          }

          return res.json({ success: true, secret: user.secret });
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "La contraseña no es válida"
        });
      }
    });
  });
});

// Exportamos el Router para usarlo en la aplicación
module.exports = router;
