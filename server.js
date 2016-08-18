var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser');
    mongoose = require('mongoose');

// Crear y configurar la aplicación
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

// conectar a la base de datos
mongoose.connect('mongodb://localhost/authApp');

// Importar los Routers
var AuthRouter = require('./app/routes/AuthRouter');

app.get('/', function(req, res) {
  res.json({ success: true });
});

app.post('/', function(req, res) {
  console.log(req.body);
  res.json({ success: true, message: "POST correcto" });
})

// Usar los Routers
app.use('/auth', AuthRouter);

app.listen(8080, function() {
  console.log("Escuchando en el puerto 8080");
});
