
  
const express = require('express');
const bodyParser = require('body-parser');

const productsRouter = express.Router();

productsRouter.use(bodyParser.json());

productsRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the products to you!');
})

.post((req, res, next) => {
    res.end('Will add your product: ' + req.body.name + ' with details: ' + req.body.description);
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on products');
})
.delete((req, res, next) => {
    res.end('Will delete all the products');
});


productsRouter.route('/:productId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})


.get((req,res,next) => {
    res.end('Will send details of your product : ' + req.params.productId);
})


.post((req, res, next) => {
  res.statusCode = 403;
  res.end('Post operation not supported on /products/'+ req.params.productId);
})

.put((req, res, next) => {
  res.write('Updating the product: ' + req.params.productId + '\n');
  res.end('Will update the product: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete((req, res, next) => {
    res.end('Deleting product: ' + req.params.productId);
});

module.exports = productsRouter;

