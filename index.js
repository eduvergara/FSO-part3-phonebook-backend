// library loading
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// initializes an Express application
const app = express()

// middleware function - takes the JSON data of a request, transforms it into a JavaScript object
// and then attaches it to the body property of the request object
app.use(express.json())
app.use(cors())
app.use(express.static('dist')) // To make Express show static conten

// middleware will be used for catching POST request body
morgan.token('bodyReq', function getBody(req) {
  return req.body
})

// custom morgan middleware
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(tokens.bodyReq(req, res)),
    ].join(' ')
  })
)

// middleware that prints information about every request that is sent to the server.
const requestLogger = (request, response, next) => {
  console.log('Method :', request.method)
  console.log('Path   :', request.path)
  console.log('Body   :', request.body)
  console.log('---')
  next() // it must call next() to pass control to the next middleware function
}
app.use(requestLogger)

// fetching all the resources
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// fetching a single resource
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        //response.statusMessage = "Current value does not match";
        response.status(400).end(0)
      }
    })
    .catch((error) => next(error))
})

// route  - deleting resource by ID
app.delete('/api/persons/:id', (request, response, next) => {
  console.log('id', request.params.id)
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// route  - add document to the DB
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const phoneNumber = body.number
  const nameUI = body.name

  // handling missing UI data
  if (!phoneNumber || !nameUI) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  // First check for duplicate name
  Person.findOne({ name: nameUI })
    .then((nameOnPhonebook) => {
      if (nameOnPhonebook !== null) {
        return response.status(400).json({
          error: 'name must be unique',
        })
      }

      // If no duplicate name, check for duplicate phone number
      return Person.findOne({ number: phoneNumber })
    })
    .then((numberOnPhonebook) => {
      if (numberOnPhonebook !== null) {
        return response.status(400).json({
          error: 'duplicate phone number',
        })
      }

      // If both checks pass, save the new person
      const person = new Person({
        name: nameUI,
        number: phoneNumber,
      })

      return person.save().then((savedPerson) => {
        response.json(savedPerson)
      })
    })
    .catch((error) => next(error))
})

// route  - update a document on the DB
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatePerson) => {
      response.json(updatePerson)
    })
    .catch((error) => next(error))
})

// middleware will be used for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// error handler middleware (has to be the last loaded)
const errorHandler = (error, request, response) => {
  console.error(error.message)
  console.log('error name: ', error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'format validation error' })
  }
}
app.use(errorHandler)

// listen to HTTP requests sent to port 3001:
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
