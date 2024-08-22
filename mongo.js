const mongoose = require("mongoose");
const password = process.argv[2];
const personName = process.argv[3];
const personNumber = process.argv[4];

// establish db connection
const url = `mongodb+srv://eduvergara:${password}@cluster0.hgi2lie.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

// schema definition
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// model definition
const Person = mongoose.model("Person", personSchema);

// retrieve all the documents from db
if (process.argv.length === 3) {
  console.log("phonebook: ");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name + " " + person.number);
      mongoose.connection.close();
    });
  });
}

// save the document to db
if (process.argv.length === 5) {
  const person = new Person({
    name: `${personName}`,
    number: `${personNumber}`,
  });

  person.save().then((result) => {
    console.log(`addded ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
  });
}
