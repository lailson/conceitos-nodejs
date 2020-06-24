const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyId(request, response, next) {
  const { id } = request.params
  const index = repositories.findIndex(repository => repository.id === id)
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID'})
  }
  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }
  next()
}

app.use('/repositories/:id',verifyId)

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const id = uuid()
  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex(repository => repository.id === id);
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[index].likes
  }
  repositories[index] = repository
  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const index = repositories.findIndex(repository => repository.id === id)

  
  repositories.splice(index,1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);
  
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
