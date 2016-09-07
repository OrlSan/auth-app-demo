var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  secret: String,
  password: String,
  age: Number
});

UserSchema.statics.generateHash = function(password, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      console.log("Error al crear el password: " + err);
      return callback(err);
    }

    bcrypt.hash(password, salt, callback);
  });
};

UserSchema.methods.checkPassword = function(inputPass, callback) {
  bcrypt.compare(inputPass, this.password, callback);
};

// Exportamos el modelo
module.exports = mongoose.model('User', UserSchema);
