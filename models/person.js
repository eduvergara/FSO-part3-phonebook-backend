// import
const mongoose = require("mongoose");

// Retrieving env variables and establish db connection
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

// defines documents structure
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// model definition (interface for interacting with the database)
const Person = mongoose.model("Person", personSchema);

// configure how Mongoose documents from personSchema are serialized to JSON
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
