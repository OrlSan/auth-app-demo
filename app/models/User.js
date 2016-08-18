var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String,
  age: Number
});

// Exportamos el modelo
module.exports = mongoose.model('User', UserSchema);
