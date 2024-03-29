require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const hostname = process.env.HOST
const port = process.env.PORT
const environment = process.env.NODE_ENV
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log("Was this hit?")
})

app.post('/temp', jsonParser, (req, res) => {
  console.log(req.body)
  res.send().status(200)
})

app.post('/humidity', jsonParser, (req, res) => {
  console.log(req.body)  
  res.send().status(200)
})

app.listen(port, hostname, () => {
  console.log(`${environment} app listening on ${hostname}:${port}`)
})