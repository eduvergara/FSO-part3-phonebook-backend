// import
const mongoose = require('mongoose')

// Retrieving env variables and establish db connection
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

// defines documents structure
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[A-Za-z\s]*$/.test(v)
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
})

// configure how Mongoose documents from personSchema are serialized to JSON
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
