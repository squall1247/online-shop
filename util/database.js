const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//Use MongoDB Atlas, set the DB URI in dbsetting.js
const dbsetting = require('./dbsetting');
const dbUri = dbsetting.dbUri;

let _db;

const mongoConnect = callback => {
    MongoClient.connect(dbUri,{ useUnifiedTopology: true } )
    .then(client =>{
        console.log('Connected!');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found!'
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;