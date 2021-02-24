const mongoose = require('mongoose');

const Products = require('./models/products');

const url = 'mongodb://localhost:27017/truck-track-be';
const connect = mongoose.connect(url);

connect.then((db) => {

    console.log('Connected correctly to server');

    Products.create({
        name: 'IphoneX',
        description: 'Test'
    })
    .then((product) => {
        console.log(product);
        
        return Products.find({}).exec();
    })
    .then((products) => {
        console.log(products);

        return Products.remove({});
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
});