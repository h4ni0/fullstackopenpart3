require("dotenv").config()
const mongoose = require("mongoose")
const password = process.env.PASSWORD
const url = `mongodb+srv://h4ni:${password}@cluster0.il851.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 4,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
})

const Person = mongoose.model("Person", personSchema)


module.exports = Person