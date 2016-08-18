var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.json({ success: true, message: "Página de perfil de " + req.user.name });
});

module.exports = router;
