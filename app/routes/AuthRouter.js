var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.json({ success: false, message: "GET not allowed" });
});

// Exportamos el Router para usarlo en la aplicación
module.exports = router;
