require("dotenv").config();
const fs = require("fs");

const express = require("express");

const morgan = require("morgan");
const cors = require("cors");
const app = express();

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

// morgan((tokens, req, res) => {
//     let logData = `${tokens.method(req, res)} ${tokens.url(
//       req,
//       res
//     )} ${tokens.status(req, res)}`;

//     if (req.method === "POST") {
//       logData += `\nPost Data: ${JSON.stringify(req.body)}`;
//     }

//     return logData;
//   })
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
  {
    content: "alscm'",
    important: true,
    id: 4,
  },
];

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.floor(Math.random() * 1000000000) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }

  response.json(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
