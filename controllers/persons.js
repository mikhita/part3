const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', async(request, response) => {
  await Person.find({}).then(persons => {
    response.json(persons)
  })
})

personsRouter.get('/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)
  if(person){
    response.json(person)
  } else{
    response.status(404).end()
  }
})

personsRouter.post('/', async(request, response) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  })
  const savedPerson = await person.save()
  response.status(201).json(savedPerson)
})


personsRouter.delete('/:id', async (request, response) => {
  await Person.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

personsRouter.put('/:id', (request, response) => {
  const { name, number } = request.body
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
})

module.exports = personsRouter