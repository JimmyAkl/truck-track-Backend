const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Shipments = require('../models/shipments');
var authenticate = require('../authenticate');

const shipmentRouter = express.Router();
shipmentRouter.use(bodyParser.json());

shipmentRouter.route('/')
.get((req,res,next) => {
    Shipments.find({})
    .then((shipments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shipments);
    }, (err) => next(err))
    .catch((err) => next(err));
})

//if logged in
.post(authenticate.verifyUser,(req, res, next) => {
    Shipments.create(req.body)
    .then((shipment) => {
        console.log('Shipment Created ', shipment);
        req.user.shipments.push(shipment);
        req.user.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shipment);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /shipments');
})

.delete(authenticate.verifyUser,(req, res, next) => {
    Shipments.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

shipmentRouter.route('/:shipmentId')
.get((req,res,next) => {
    Shipments.findById(req.params.shipmentId)
    .then((shipment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shipment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /shipments/'+ req.params.shipmentId);
})
.put(authenticate.verifyUser,(req, res, next) => {
   Shipments.findByIdAndUpdate(req.params.shipmentId, {
        $set: req.body
    }, { new: true })
    .then((shipment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shipment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Shipments.findByIdAndRemove(req.params.shipmentId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

shipmentRouter.route('/:shipmentId/updates')
.get((req,res,next) => {
    Shipments.findById(req.params.shipmentId)
    .then((shipment) => {
        if (shipment != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(shipment.updates);
        }
        else {
            err = new Error('Shipment ' + req.params.shipmentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Shipments.findById(req.params.shipmentId)
    .then((shipment) => {
        if (shipment != null) {
            shipment.updates.push(req.body);
            shipment.save()
            .then((shipment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shipment);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Shipment ' + req.params.shipmentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /shipments/'
        + req.params.shipmentId + '/updates');
})
.delete((req, res, next) => {
    Shipments.findById(req.params.shipmentId)
    .then((shipment) => {
        if (shipment != null) {
            for (var i = (shipment.updates.length -1); i >= 0; i--) {
                shipment.updates.id(shipment.updates[i]._id).remove();
            }
            shipment.save()
            .then((shipment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shipment);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Shipment ' + req.params.shipmentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

shipmentRouter.route('/:shipmentId/updates/:updateId')
.get((req,res,next) => {
    Shipments.findById(req.params.shipmentId)
    .then((shipment) => {
        if (shipment != null && shipment.updates.id(req.params.updateId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(shipment.updates.id(req.params.updateId));
        }
        else if (shipment == null) {
            err = new Error('Shipment ' + req.params.shipmentId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Update ' + req.params.updateId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /shipments/'+ req.params.shipmentId
        + '/updates/' + req.params.updateId);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /shipments/'
        + req.params.shipmentId + '/updates/' + req.params.updateId);
})
.delete((req, res, next) => {
    Shipments.findById(req.params.shipmentId)
    .then((shipment) => {
        if (shipment != null && shipment.updates.id(req.params.updateId) != null) {
            shipment.updates.id(req.params.updateId).remove();
            shipment.save()
            .then((shipment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shipment);                
            }, (err) => next(err));
        }
        else if (shipment == null) {
            err = new Error('Shipment ' + req.params.shipmentId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Update' + req.params.updateId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = shipmentRouter;