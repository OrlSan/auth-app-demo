var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
  title: String,
  contents: String,
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date
  },
  ownerID: {
    type: String,
    required: true
  }
});

NoteSchema.pre('save', function(next) {
  this.modified = new Date();

  next();
});

// Exportar el modelo
module.exports = mongoose.model('Note', NoteSchema);
