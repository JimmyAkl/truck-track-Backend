const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'truck-track-be';

const dboper = require('./operations');

MongoClient.connect(url).then((client) => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    dboper.insertDocument(db, { name: "Iphone10", description: "Best iphone in town"},
        "products")
        .then((result) => {
            console.log("Insert Document:\n", result.ops);

            return dboper.findDocuments(db, "products");
        })
        .then((docs) => {
            console.log("Found Documents:\n", docs);

            return dboper.updateDocument(db, { name: "Iphone12" },
                    { description: "Updated Test" }, "products");

        })
        .then((result) => {
            console.log("Updated Document:\n", result.result);

            return dboper.findDocuments(db, "products");
        })
        .then((docs) => {
            console.log("Found Updated Documents:\n", docs);
                            
            return db.dropCollection("products");
        })
        .then((result) => {
            console.log("Dropped Collection: ", result);

            return client.close();
        })
        .catch((err) => console.log(err));

})
.catch((err) => console.log(err));
      
    
