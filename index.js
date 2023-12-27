const express = require('express');
const app = express();
const morgan = require('morgan');

//Lets create a new morgan token to be able to display the request body. this means that morgan must run after body-parser!
morgan.token('data', (req, res) => JSON.stringify(req.body));

//Creating our own middleware!
const requestLogger = (request, response, next) => {
  console.log('Method', request.method);
  console.log('Method', request.path);
  console.log('Method', request.body);
  console.log('---');
  next();
}
//Middleware 
app.use(express.json());
app.use(requestLogger);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

let people = [
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

app.get('/api/persons', (request, response) => {
  console.log(people)
  response.json(people);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = people.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).send('No person found');
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  people = people.filter((p) => p.id !== id);
  response.status(204).send('Successful Deletion!');
  console.log(people);
})

app.get('/info', (request, response) => {
  const numberOfPeople = people.length;
  console.log(numberOfPeople);
  let date = new Date();
  response.send(`<p>Phonebook has info for ${numberOfPeople} people</p><p>${date}</p>`);
})

const generateRandomId = () => {
  return Math.ceil(Math.random() * 100);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const name = body.name;
  const number = body.number;
  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: 'Name or number is missing...',
    })
  } else if (people.some(p => p.name === name)) {
    return response.status(400).json({
      error: 'Name must be unique...',
    })
  }

  const newPerson = {
    id: generateRandomId(),
    name,
    number,
  }
  people = people.concat(newPerson);
  console.log(body, newPerson);
  response.json(newPerson);
})

//lets refactor the POST!
const generateId = (arr) => {
  const maxId = arr.length > 0 ? Math.max(...arr.map(n => n.id)) : 0
  return maxId + 1;
}

app.post('/api/notes', (request, response) => { 
  const body = request.body;

  if (!body.content) {
    //we HAVE to call return to exit out of the function otherwise, the code will keep executing and store an incomplete note!
    return response.status(400).json({
      error: 'content is missing'
    });
  };

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(notes),
  }

  notes = notes.concat(note);

  response.json(note);
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

app.get('/api/notes', (request, response) => {
  response.json(notes);
})
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = 'Sorry that resource doesn\'t exist!'
    response.status(404).end();
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  
  response.status(204).end();
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 2277;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
