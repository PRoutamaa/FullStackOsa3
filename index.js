require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.method(req, res) === "POST"
    ? JSON.stringify(req.body)
    : ""
  ].join(' ')
}))


app.get('/info', (req, res) => {
  Person.find({}).then(people => {
    res.send(
   `<p>Phonebook has info for ${people.length} people </p>

   <p>${new Date}</p>`
    )
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    numberOfPeople = people.length
    console.log(people.length)
    res.json(people)
  })
})

app.get(`/api/persons/:id`, (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
  .catch(error => next(error))
})

app.post(`/api/persons`, (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name is missing'
    })
  } else if (body.number === undefined){
    return res.status(400).json({
      error: 'number is missing'
    })
  }
  
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
  })
  
  
})

app.delete(`/api/persons/:id`, (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const updatedPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
    .then(updatedFile => {
      res.json(updatedFile)
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})