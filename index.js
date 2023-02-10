require("dotenv").config();
const fs = require("fs");

const express = require("express");

const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");
const mongoose = require("mongoose");
const password = process.env.API_KEY;

app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    let logData = `${tokens.method(req, res)} ${tokens.url(
      req,
      res
    )} ${tokens.status(req, res)}`;
    if (req.method === "POST") {
      logData += `\nPost Data: ${JSON.stringify(req.body)}`;
    } else if (req.method === "PUT") {
      logData += `\nPut Data: ${JSON.stringify(req.body)}`;
    }
    return logData;
  })
);
app.use(cors());
app.use(express.static("build"));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});
app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>PhoneBook has info for ${Person.length} people.</p><p> Response date: ${date}</p>`
  );
});
// app.get("/api/notes/:id", (request, response) => {
//   Note.findById(request.params.id).then((note) => {
//     response.json(note);
//   });
// });

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      console.log("I am in delete section");
      response.status(204).end();
    })
    .catch((error) => next(error));
});
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  console.log(person);

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });

  // const name = body.name;
  // const hasExactName = (name) => (person) => person.name === name;

  // if (persons.some(hasExactName(name))) {
  //   console.log("hasexactname", hasExactName(name));
  //   return res.json(person);
  // res.status(400).json({
  //   error: "name must be unique",
  // });
  // }

  // persons = persons.concat(person);

  // res.json(person);
});

const PORT = process.env.PORT || 3001;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
