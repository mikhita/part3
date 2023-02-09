require("dotenv").config();
const fs = require("fs");

const express = require("express");

const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");
// console.log(Person);
const mongoose = require("mongoose");
const password = process.env.API_KEY;

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const url = `mongodb+srv://Mikheil:${password}@cluster0.xgq3fri.mongodb.net/personApp?retryWrites=true&w=majority`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url);

// const personSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// });

// const Person = mongoose.model("Person", personSchema);

app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    let logData = `${tokens.method(req, res)} ${tokens.url(
      req,
      res
    )} ${tokens.status(req, res)}`;
    if (req.method === "POST") {
      logData += `\nPost Data: ${JSON.stringify(req.body)}`;
    }
    return logData;
  })
);
app.use(cors());
app.use(express.static("build"));

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});
// app.get("/info", (req, res) => {
//   const date = new Date();
//   res.send(
//     `<p>PhoneBook has info for ${persons.length} people.</p><p> Response date: ${date}</p>`
//   );
// });
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

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params._id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.floor(Math.random() * 1000000000) : 0;
//   return maxId + 1;
// };

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

  // const person = {
  //   id: generateId(),
  //   name: body.name,
  //   number: body.number,
  // };

  // const name = body.name;
  // const hasExactName = (name) => (person) => person.name === name;

  // if (persons.some(hasExactName(name))) {
  //   return res.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  // persons = persons.concat(person);

  // res.json(person);
});

const PORT = process.env.PORT || 3001;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
