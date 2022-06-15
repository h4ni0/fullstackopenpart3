const express = require("express")
const cors = require("cors")
const app = express()
const morgan = require("morgan")


app.use(express.json())
app.use(cors())
app.use(express.static("build"))

morgan.token('obj', (req) =>  JSON.stringify(req.body) )

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.method(req, res) == "POST" ? tokens.obj(req) : ""
  ].join(' ')
}))



persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// get requests
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) { 
        res.json(person)
    } else {
        res.status(404).json({
            error: "Person not found"
        })
    }
})

// delete request
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

// post requests
app.post('/api/persons', (req, res) => {
    const person = req.body

    if (req.body.name && req.body.number && !persons.find(person => person.name === req.body.name)) {
        person.id = Math.ceil(Math.random() * 99999999999)
        persons = persons.concat(person)
        res.json(person)
    } else {
        res.status(400)
        if (!req.body.name) {
            res.json({
                error: 'no name provided'
            })
        } else if (!req.body.number) {
            res.json({
                error: 'no number provided'
            })
        } else {
            res.json({
                error: 'name must be unique'
            })
        }
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server is running...")
})