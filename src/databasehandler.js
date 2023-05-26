const sqlite3 = require('sqlite3').verbose();

const hostname = process.env.HOST
const port = process.env.PORT
const environment = process.env.NODE_ENV
const database = process.env.DATABASE

exports.selectHumidity = (req, res) => {
    console.log(req.query)
    const selectHumidityFromDb = (callback) => {
        var list = [];
        var db = new sqlite3.Database(database);      
        var params = [req.query.start, req.query.end]
        db.all(`SELECT humidity, timestamp FROM humidity where timestamp BETWEEN ? AND ?`, 
                params,
                (err,rows) => {
             if(err) return callback(err);
             rows.forEach(function(row) {
                list.push(row);
             })
            db.close();
            return callback(null, list);
        }); 
    }
    
    const selectHumidityCallback = (err, data) => {    
        if (err) {            
            res.send(err).status(500)
            throw err; // Check for the error and throw if it exists.
        }    
        res.send(data).status(200)
    } 
    selectHumidityFromDb(selectHumidityCallback)
}

exports.selectTemperature = (req, res) => {
    console.log(req.query)
    const selectTemperatureFromDb = (callback) => {
        var list = [];
        var db = new sqlite3.Database(database);      
        var params = [req.query.start, req.query.end]
        db.all(`SELECT temperature, timestamp FROM temperature where timestamp BETWEEN ? AND ?`, 
                params,
                (err,rows) => {
             if(err) return callback(err);
             rows.forEach(function(row) {
                list.push(row);
             })
            db.close();
            return callback(null, list);
        }); 
    }
    
    const selectTemperatureCallback = (err, data) => {    
        if (err) {            
            res.send(err).status(500)
            throw err; // Check for the error and throw if it exists.
        }    
        res.send(data).status(200)
    } 
    selectTemperatureFromDb(selectTemperatureCallback)
}