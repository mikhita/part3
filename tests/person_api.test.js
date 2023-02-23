const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const Person = require('../models/person')


// beforeEach(async () => {
//   await Person.deleteMany({})
//   let personObject = new Person(helper.initialPersons[0])
//   await personObject.save()
//   personObject = new Person(helper.initialPersons[1])
//   await personObject.save()
// }, 100000)

beforeEach(async () => {
  await Person.deleteMany({})

  for (let person of helper.initialPersons) {
    let personObject = new Person(person)
    await personObject.save()
  }
}, 100000)


test('persons are returned as json', async () => {
  console.log('entered test')
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('there are three persons', async () => {
  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(helper.initialPersons.length)
}, 100000)

test('the first person is about Arto Hella', async () => {
  const response = await api.get('/api/persons')
  const names = response.body.map(r => r.name)
  expect(names).toContain(
    'Arto Hella'
  )
})

test('a valid person can be added', async () => {
  const newPerson = {
    name: 'Ani Avazneli',
    number: '439-3999330',
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const personsAtEnd = await helper.personsInDb()
  expect(personsAtEnd).toHaveLength(helper.initialPersons.length + 1)

  const names = personsAtEnd.map(n => n.name)
  expect(names).toContain(
    'Ani Avazneli'
  )
})

test('person without name is not added', async () => {
  const newPerson = {
    number: true
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(400)

  const personsInDb = await helper.personsInDb()

  expect(personsInDb).toHaveLength(helper.initialPersons.length)
})

test('a specific person can be viewed', async () => {
  const personsAtStart = await helper.personsInDb()

  const personToView = personsAtStart[0]

  const resultPerson = await api
    .get(`/api/persons/${personToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultPerson.body).toEqual(personToView)
})

test('a person can be deleted', async () => {
  const personsAtStart = await helper.personsInDb()
  const personToDelete = personsAtStart[0]

  await api
    .delete(`/api/persons/${personToDelete.id}`)
    .expect(204)

  const personsAtEnd = await helper.personsInDb()

  expect(personsAtEnd).toHaveLength(
    helper.initialPersons.length - 1
  )

  const names = personsAtEnd.map(r => r.name)

  expect(names).not.toContain(personToDelete.name)
})

afterAll(async () => {
  await mongoose.connection.close()
})

