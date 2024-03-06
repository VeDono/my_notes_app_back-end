const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const port = 5000;

fs.access('notes.json', fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFile('notes.json', '[]', err => {
      if (err) throw err;
      console.log('File is created successfully.');
    }); 
  }
});

app.use(express.json());
app.use(cors());

app.get('/notes', (_, res) => {
  fs.readFile('notes.json', (err, data) => {
      if (err) throw err;
      let notes = JSON.parse(data);
      res.send(notes);
  });
});

app.post('/notes', (req, res) => {
  fs.readFile('notes.json', (err, data) => {
      if (err) throw err;
      let notes = JSON.parse(data);
      notes.push(req.body);
      fs.writeFile('notes.json', JSON.stringify(notes), (err) => {
          if (err) throw err;
          res.status(201).send('Note added');
      });
  });
});

app.delete('/notes/:id', (req, res) => {
  fs.readFile('notes.json', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter(note => String(note.id) !== String(req.params.id));
    fs.writeFile('notes.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.status(200).send('Note deleted');
    });
  });
});

app.put('/notes/:id', (req, res) => {
  fs.readFile('notes.json', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.map(note => note.id === req.params.id ? req.body : note);
    fs.writeFile('notes.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.status(200).send('Note updated');
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http:localhost:${port}/`);
});
