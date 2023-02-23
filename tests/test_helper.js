const Person = require('../models/person')

const initialPersons = [
  {
    name: 'Arto Hella',
    number: '040-123456'
  },
  {
    name: 'Arto Hella2',
    number: '040-1234562'
  }
]

const nonExistingId = async () => {
  const person = new Person({ name: 'willremovethissoon' })
  await person.save()
  await person.remove()

  return person._id.toString()
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map(person => person.toJSON())
}

module.exports = {
  initialPersons, nonExistingId, personsInDb
}