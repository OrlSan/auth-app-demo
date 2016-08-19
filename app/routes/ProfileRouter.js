var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', function(req, res) {
  res.json({ success: true, message: "Página de perfil de " + req.user.name });
});

router.post('/changePass', function(req, res) {
  var body = req.body;

  if (body.currentPass == '' || body.newPass == '') {
    return res.json({
      success: false,
      message: "Se esperaban currentPass y newPass en el cuerpo de la petición"
    });
  }

  req.user.checkPassword(body.currentPass, function(errPass, valid) {
    if (errPass) {
      return res.status(500).json({
        success: false,
        message: "Error interno con la contraseña"
      });
    }

    if (valid) {
      User.generateHash(body.newPass, function(genErr, newHash) {
        if (genErr) {
          return res.status(500).json({
            success: false,
            message: "Error interno con la contraseña"
          });
        }

        req.user.password = newHash;

        req.user.save(function(errSave) {
          if (errSave) {
            return res.status(500).json({
              success: false,
              message: "Error interno en la base de datos"
            });
          } else {
            return res.json({
              success: true,
              message: "La contraseña se cambió adecuadamente"
            });
          }
        });
      });
    } else {
      return res.json({
        success: false,
        message: "La contraseña actual no coincide. No se puede cambiar"
      })
    }
  });
});

module.exports = router;
