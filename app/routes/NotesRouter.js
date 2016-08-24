var express = require('express');
var router = express.Router();
var Note = require('../models/Note');

router.get('/', function(req, res) {
  Note.find({ ownerID: req.user.id }).lean().exec(function(errSearch, notes) {
    if (errSearch) {
      return res.status(500).json({
        success: false,
        message: "Error interno en la base de datos"
      });
    }

    res.json({
      count: notes.length,
      notes: notes
    });
  });
});

router.post('/create', function(req, res) {
  var body = req.body;

  if (body.title == "" || body.contents == "") {
    return res.json({
      success: false,
      message: "Se esperaban parámetros: title y contents"
    });
  }

  var newNote = new Note({
    title: body.title,
    contents: body.contents,
    ownerID: req.user.id
  });

  newNote.save(function(saveErr) {
    if (saveErr) {
      return res.status(500).json({
        success: false,
        message: "Error al guardar en la base de datos"
      });
    }

    res.json({
      success: true,
      message: "La nota fue creada correctamente",
      note: newNote
    });
  });
});

router.put('/:noteID', function(req, res) {
  Note.findOne({ _id: req.params.noteID, ownerID: req.user.id }, function(errSearch, note) {
    if (errSearch) {
      return res.status(500).json({
        success: false,
        message: "Error en la base de datos"
      });
    }

    if (note) {
      note.title = req.body.title ? req.body.title : note.title;
      note.contents = req.body.contents ? req.body.contents : note.contents;

      note.save(function(errSave) {
        if (errSave) {
          return res.status(500).json({
            success: false,
            message: "Error al guardar en la base de datos"
          });
        }

        return res.json({
          success: true,
          message: "Nota actualizada correctamente"
        });
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No se encontró la nota con el ID " + req.params.noteID
      });
    }
  });
});

router.delete('/:noteID', function(req, res) {
  Note.findOne({ _id: req.params.noteID, ownerID: req.user.id }, function(errSearch, note) {
    if (errSearch) {
      return res.status(500).json({
        success: false,
        message: "Error en la base de datos"
      });
    }

    if (note) {
      note.remove(function(errDelete) {
        if (errDelete) {
          return res.status(500).json({
            success: false,
            message: "Error en la base de datos"
          });
        }

        res.json({
          sucess: true,
          message: "Nota borrada correctamente"
        });
      })
    } else {
      return res.status(404).json({
        success: false,
        message: "No se encontró la nota con el ID " + req.params.noteID
      });
    }
  });
});

module.exports = router;
