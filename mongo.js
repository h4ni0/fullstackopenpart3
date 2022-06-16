const mongoose = require("mongoose")
const password = process.argv[2]
const url = `mongodb+srv://h4ni:${password}@cluster0.il851.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model("Person", personSchema)

const name = process.argv[3]
const number = process.argv[4]

if (!!name  && !!number) {
    mongoose
        .connect(url)
        .then((result) => {
            const person = new Person({
                name: name,
                number: number
            })

            return person.save()
                        .then(() => {
                            console.log("Added", person.name, "number", person.number)
                            return mongoose.connection.close()
                        })
                        .catch((err) => console.log(err))
        })
} else {
    mongoose
        .connect(url)
        .then((result) => {
            Person.find({}).then(res => {
                console.log("phonebook:")
                res.forEach(person => {console.log(person.name, person.number)})
                mongoose.connection.close()
            })
        })
}