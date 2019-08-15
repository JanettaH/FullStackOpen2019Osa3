require('dotenv').config()
const Person = require('./models/person')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')
morgan.token('body', function (req, res) {
     return JSON.stringify(req.body) 
    });
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

const cors = require('cors')


app.use(cors())
app.use(bodyParser.json())
//app.use(morgan("tiny"))
app.use(express.static('build'))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ];

app.get('/', (req, res) => {
  res.send('<h1>Hello All!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
})



app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON())
  })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
  })


  app.post('/api/persons', (req, res) => {
    const body = req.body

    if(body.name == '' || body.name == null || body.number == '' || body.number == null) {
        res.json({error: 'please fill out all required fields'})
        return;
    }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
})


app.get('/info', (req, res) => {
    let personsCount = persons.length;
    let date = new Date();
    let layout = '<p>Phonebook has info for ' + personsCount + ' people</p>' + 
    '<p>'+ date + '</p>'
    res.send(layout)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})