const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

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

let notes = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-123456"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "050-123456"
  },
  {
    id: "4",
    name: "Mary Poppins",
    number: "39-23-123456"
  }
]

app.get('/info', (req, res) => {
  res.send(
   `<p>Phonebook has info for ${notes.length} people </p>

    <p>${new Date}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(notes)
})

app.get(`/api/persons/:id`, (req, res) => {
  const id = req.params.id
  const result = notes.filter((person) => person.id === id)
  if (result.length !== 0) {
  res.json(result)
  } else {
    res.status(404).end()
  }
})

app.post(`/api/persons`, (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name is missing'
    })
  } else if (!body.number){
    return res.status(400).json({
      error: 'number is missing'
    })
  } else if (notes.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name already in the phonebook'
    })
  }
  const id = Math.floor(Math.random() * 100)
  const newPerson = {
    id: id.toString(),
    name: body.name,
    number: body.number
  }
  notes = notes.concat(newPerson)
  res.json(newPerson)
  
})

app.delete(`/api/persons/:id`, (req, res) => {
  const id = req.params.id
  notes = notes.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})