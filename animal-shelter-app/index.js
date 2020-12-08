require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const port = process.env.PORT;
const animalController = require('./controllers/AnimalController')

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose.set('useFindAndModify', false)

app.use(express.urlencoded({
  extended: true
}))
app.use(cors({
  origin: '*'
}))

app.options('*', cors())

app.get('/api/v1', (req, res) => {
  res.json({ "message": "Welcome to animal shelter API v1" })
})

// index route
app.get('/api/v1/animals', animalController.listAnimals)

// create route
app.post('/api/v1/animals', animalController.createAnimal)

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(response => {
    // DB connected successfully
    console.log('DB connection successful')

    app.listen(port, () => {
      console.log(`Animal shelter app listening on port: ${port}`)
    })
  })
  .catch(err => {
    console.log(err)
  })
