const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./models/person")
const app = express()


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



// get requests
app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})



app.get('/info', (req, res) => {
    let count = 0
    Person.find({}).then(result => {res.send(`
    <p>Phonebook has info for ${ result.length } people</p>
    <p>${new Date()}</p>
    `) })
    
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(foundPerson => {
        if (foundPerson) {
            res.json(foundPerson)
        } else {
            res.status(404).end()
        }
    }).catch(error => {
      console.log(error)
      res.status(400).send({erro: "malformatted id"})
    })
})


// delete request
app.delete('/api/persons/:id', (req, res) => {
    console.log(req.params)
    Person.findByIdAndRemove(req.params.id)
    .then(foundPerson => {
        console.log('success')
        res.status(204).end()
    })
    .catch(err => {
        res.status(404).end(err)
    })
    
})

// post requests
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (req.body.name && req.body.number) {
        person = new Person({
            name: body.name,
            number: body.number
        })
        person.save().then(result => {

            res.json(person)    
        })
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