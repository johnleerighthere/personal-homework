const AnimalModel = require('../models/Animal')

const controllers = {
    listAnimals: (req, res) => {
        AnimalModel.find()
            .then(results => {
                res.json(results)
            })
            .catch(err => {
                res.json(err)
            })
    },
    createAnimal: (req, res) => {
        AnimalModel.create({
            name: req.body.name,
            species: req.body.species,
            breed: req.body.breed,
            sex: req.body.sex,
            image: req.body.image,
            age: req.body.age,
            adopted: req.body.adopted,
        })
            .then(result => {
                res.statusCode = 201 // animal created in db
                res.json(result)
            })
            .catch(err => {
                res.json(err)
            })
    },
}

module.exports = controllers
