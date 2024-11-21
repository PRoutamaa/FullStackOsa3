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
  res.send(
   `<p>Phonebook has info for ${notes.length} people </p>

    <p>${new Date}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    console.log(people)
    res.json(people)
  })
})

app.get(`/api/persons/:id`, (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
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

app.delete(`/api/persons/:id`, (req, res) => {
  const id = req.params.id
  notes = notes.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})