require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jsonParser = bodyParser.json()
const sqlite3 = require('sqlite3').verbose();
const databasehandler = require('./databasehandler')


const hostname = process.env.HOST
const port = process.env.PORT
const environment = process.env.NODE_ENV
const database = process.env.DATABASE

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log("Was this hit?")
})

app.post('/temp', jsonParser, (req, res) => {
  // console.log(req.body)
  try {
    insertTemperature(req.body.sensorName, req.body.temp, req.body.timestamp)
  } catch(e) {
    res.send(req.body).status(500)
  }
  res.send(req.body).status(200)
})

app.post('/humidity', jsonParser, (req, res) => {
  // console.log(req.body)  
  try {
    insertHumidity(req.body.sensorName, req.body.humidity, req.body.timestamp)
  } catch(e) {
    res.send(req.body).status(500)
  }
  res.send(req.body).status(200)
})

app.get('/humidity', jsonParser, async(req, res) => {
  console.log('hit get /humidity');
  databasehandler.selectHumidity(req, res)
})

app.get('/temp', jsonParser, async(req, res) => {
  console.log('hit get /temp');
  databasehandler.selectTemperature(req, res)
})

app.listen(port, hostname, () => {
  console.log(`${environment} app listening on ${hostname}:${port}`)
  console.log(`Using database: ${database}`)
  dbTest()
})

const dbTest = async() => {  
  let db = new sqlite3.Database(database, (err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to the greenhouse database.');
  });

  db.close()
}

const insertHumidity = async(sensorName, humidity, timestamp) => {

  let db = new sqlite3.Database(database, (err) => {
    if (err) {
      throw err;
    }
    // console.log('Connected to the greenhouse database.');
  });

  try {
    const result = await db.run(
      'INSERT INTO humidity(sensor_name, humidity, timestamp) VALUES (:sensorName, :humidity, :timestamp)', {
        ':sensorName':sensorName,
        ':humidity': Number.parseFloat(humidity).toFixed(1),
        ':timestamp': timestamp
      })

      // console.log(result)
      console.log("Humidity Insert:", formatTimestamp())
  } catch(e) {
    console.log(e)
  }

  db.close()
}

const insertTemperature = async(sensorName, temperature, timestamp) => {

  let db = new sqlite3.Database(database, (err) => {
    if (err) {
      throw err;
    }
    // console.log('Connected to the greenhouse database.');
  });

  try {
    const result = await db.run(
      'INSERT INTO temperature(sensor_name, temperature, timestamp) VALUES (:sensorName, :temperature, :timestamp)', {
        ':sensorName':sensorName,
        ':temperature': Number.parseFloat(temperature).toFixed(1),
        ':timestamp': timestamp
      })

      console.log("Temperature Insert:", formatTimestamp())
  } catch(e) {
    console.log(e)
  }

  db.close()
}

const formatTimestamp = () => {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}