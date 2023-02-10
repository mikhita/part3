// const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// const password = process.argv[2];

// const url = `mongodb+srv://Mikheil:${password}@cluster0.xgq3fri.mongodb.net/personApp?retryWrites=true&w=majority`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url);

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });

// const Person = mongoose.model("Person", personSchema);

// const person = new Person({
//   name: "Arto Hella",
//   number: "040-123456",
// });

// person.save().then((result) => {
//   console.log("person saved!");
//   mongoose.connection.close();
// });

// Person.find({}).then((result) => {
//   result.forEach((person) => {
//     console.log(person);
//   });
//   mongoose.connection.close();
// });
