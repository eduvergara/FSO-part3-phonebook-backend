// library loading
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// initializes an Express application
const app = express();

// middleware function - takes the JSON data of a request, transforms it into a JavaScript object
// and then attaches it to the body property of the request object
app.use(express.json());
app.use(cors());

// DATA
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// middleware will be used for catching POST request body
morgan.token("bodyReq", function getBody(req) {
  return req.body;
});

// custom morgan middleware
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(tokens.bodyReq(req, res)),
    ].join(" ");
  })
);

// middleware that prints information about every request that is sent to the server.
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next(); // it must call next() to pass control to the next middleware function
};
app.use(requestLogger);

// notes.map(n => Number(n.id)) is an array so it can't directly be given as a parameter to Math.max.
// The array can be transformed into individual numbers by using the "three dot" spread syntax ....
const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

// fetching all the resources
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// fetching a single resource
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "Current value does not match";
    response.status(400).end(0);
  }
});

// route  - deleting resource by ID
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  console.log(id);
  persons = persons.find((person) => person.id !== id);
  response.status(204).end();
});

// route  - receiving data
app.post("/api/persons", (request, response) => {
  const body = request.body;
  const phoneNumber = body.number;
  const name = body.name;

  // error handling for creating new entries
  const numberOnPhonebook = persons.find(
    (person) => person.number === phoneNumber
  )
    ? true
    : false;

  const nameOnPhonebook = persons.find((person) => person.name === name)
    ? true
    : false;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (numberOnPhonebook === true) {
    return response.status(400).json({
      error: "duplicate phone number",
    });
  }

  if (nameOnPhonebook === true) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  // resource is added correctly
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

// route
app.get("/info", (request, response) => {
  const personsLength = persons.length;
  const dateRequest = new Date();

  // There can only be one response.send() statement in an Express app route.
  response.send(
    `<h3>Phonebook has info for ${personsLength} people</h3> <h3>${dateRequest}</h3>`
  );
});

// route
app.get("/", function (req, res) {
  res.send("hello, world!");
});

// middleware will be used for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// listen to HTTP requests sent to port 3001:
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
