const express = require('express')
const app = express()


var MongoClient = require('mongodb').MongoClient

var cacheResult = null;


var bodyParser = require('body-parser');
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

MongoClient.connect('mongodb://oridomeni:meni1234@ds141232.mlab.com:41232/imdb', function (err, db) {
    if (err) throw err;

    db.collection('imdb').find().toArray(function (err, result) {
        if (err) throw err;

        console.log(result);
        cacheResult = result;
    })
});

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.jsonp(cacheResult);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});