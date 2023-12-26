const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

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

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' });
//   response.end(JSON.stringify(notes));
// })

// app.post('/api/notes', (request, response) => {
//   // const note = request.body;
//   // console.log(note);
//   // response.json(note);
//   const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
  
//   const note = request.body
//   note.id = maxId + 1;

//   notes = notes.concat(note);

//   response.json(note);
// })

//lets refactor the POST!
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
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
    id: generateId(),
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

const PORT = process.env.PORT || 2277;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
