require('dotenv').config();
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

morgan.token('body', req => JSON.stringify(req.body));

const cors = require('cors');
const Person = require('./models/person');

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
);

// app.use(morgan("tiny"))

app.get('/', (req, res) => {
  res.send('<h1>Hello All!</h1>');
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(person => person.toJSON()));
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person.toJSON());
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  if (
    body.name == '' ||
    body.name == null ||
    body.number == '' ||
    body.number == null
  ) {
    res.json({ error: 'please fill out all required fields' });
    return;
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.get('/info', (req, res, next) => {
  Person.countDocuments()
    .then(count => {
      const date = new Date();
      const layout =
        `<p>Phonebook has info for ${count} people</p>` + `<p>${date}</p>`;
      res.send(layout);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true
  })
    .then(updatePerson => {
      res.json(updatePerson.toJSON());
    })
    .catch(error => next(error));
});

// olemattomien routejen käsittely
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
