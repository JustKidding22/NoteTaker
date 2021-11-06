var express = require("express");
var path = require("path");
var fs = require("fs");
const { notStrictEqual } = require("assert");

var app = express();
var PORT = process.env.PORT || 3300;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Routes
//render notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));

});

//save a new note
app.post("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
    if (error) {
      return console.log(error)
    }
    notes = JSON.parse(notes)
    if(notes.length>0){
      var id = notes[notes.length - 1].id + 1
    }
    else{
      var id= 0;
    }
    var newNote = { id: id, title: req.body.title, text: req.body.text }
    var activeNote = notes.concat(newNote)

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(activeNote), function (error, data) {
      if (error) {
        return error
      }
      res.json(activeNote);
    })
  })
})

//Pull all notes data from database file
app.get("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
    if (error) {
      return console.log(error)
    }
    console.log(JSON.parse(data));
    res.json(JSON.parse(data))
  })
});

//Delete a note using id
app.delete("/api/notes/:id", function (req, res) {
  const noteId = JSON.parse(req.params.id)
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
    if (error) {
      return console.log(error)
    }
    notes = JSON.parse(notes)

    notes = notes.filter(val => val.id !== noteId)

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), function (error, data) {
      if (error) {
        return error
      }
      res.json(notes)
    })
  })
})

// render index page
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Starting server
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});