require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const hostname = process.env.HOST
const port = process.env.PORT
const environment = process.env.NODE_ENV
const database = process.env.DATABASE
const jsonParser = bodyParser.json()
const sqlite3 = require('sqlite3').verbose();


app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log("Was this hit?")
})

app.post('/temp', jsonParser, (req, res) => {
  console.log(req.body)
  try {
    insertTemperature(req.body.sensorName, req.body.temperature, req.body.timestamp)
  } catch(e) {
    res.send(req.body).status(500)
  }
  res.send(req.body).status(200)
})

app.post('/humidity', jsonParser, (req, res) => {
  console.log(req.body)  
  try {
    insertHumidity(req.body.sensorName, req.body.humidity, req.body.timestamp)
  } catch(e) {
    res.send(req.body).status(500)
  }
  res.send(req.body).status(200)
})

app.listen(port, hostname, () => {
  console.log(`${environment} app listening on ${hostname}:${port}`)
  console.log(`Using database: ${database}`)
  dbTest()
})

const dbTest = async() => {  
  let languages = ['C++', 'Python', 'Java', 'C#', 'Go']

  let db = new sqlite3.Database(database, (err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to the greenhouse database.');
  });

  try {
    const rowsCount = await db.each(
      'select * from humidity limit 1',
      (err, row) => {
        if(err){
          throw err;
        }

        console.log(row)
      }
    )

  } catch (e) {
    console.error(e.message);
    throw e
  }

  db.close()
}

const insertHumidity = async(sensorName, humidity, timestamp) => {

  let db = new sqlite3.Database(database, (err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to the greenhouse database.');
  });

  try {
    const result = await db.run(
      'INSERT INTO humidity(sensor_name, humidity, timestamp) VALUES (:sensorName, :humidity, :timestamp)', {
        ':sensorName':sensorName,
        ':humidity': humidity,
        ':timestamp': timestamp
      })

      console.log(result)
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
    console.log('Connected to the greenhouse database.');
  });

  try {
    const result = await db.run(
      'INSERT INTO temperature(sensor_name, temperature, timestamp) VALUES (:sensorName, :temperature, :timestamp)', {
        ':sensorName':sensorName,
        ':temperature': temperature,
        ':timestamp': timestamp
      })

      console.log(result)
  } catch(e) {
    console.log(e)
  }

  db.close()
}