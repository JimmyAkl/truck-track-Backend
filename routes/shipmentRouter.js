const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Shipments = require('../models/shipments');
const Users = require('../models/user');
var authenticate = require('../authenticate');
const user = require('../models/user');

const shipmentRouter = express.Router();
shipmentRouter.use(bodyParser.json());

shipmentRouter.route('/')
.get(authenticate.verifyUser,(req,res,next) => {
    if (req.user.admin) {   //supervisor shipments with access on all fields
    Shipments.find({ supervisoremail: req.user.username })
    .then((shipments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shipments);
    }, (err) => next(err))
    .catch((err) => next(err));
    }
    else if (!req.user.admin) { //client shipments with access on certain fields only
        Shipments.find({ clientemail: req.user.username })
            .then((shipments) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shipments);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    (err) => next(err)
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,async function(req, res, next) { //only for admins
    if (req.user.admin) {
        Shipments.create(req.body)
        .then((shipment) => {
            Shipments.findById(shipment._id)
            .then((shipment) => {
                shipment.supervisoremail = req.user.username;  //email of supervisor not required in post
                shipment.save();
                console.log('Shipment Created ', shipment);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shipment);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('User ' + req.user + ' not admin');
        err.status = 404;
        return next(err);
    } (err) => next(err)
    .catch((err) => next(err));
})

.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /shipments');
})

.delete(authenticate.verifyUser,(req, res, next) => { //supervisor deletes all his shipments
    if (req.user.admin) {
    Shipments.remove({ supervisoremail: req.user.username })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
        }
    else {
        err = new Error('User ' + req.user + ' not admin');
        err.status = 404;
        return next(err);
    } (err) => next(err)
    .catch((err) => next(err));   
});

shipmentRouter.route('/:shipmentId')
// to access shipment by ID
.get(authenticate.verifyUser,(req,res,next) => {
    if (req.user.admin) { //make sure admin and his own shipments
        Shipments.find({ _id: req.params.shipmentId, supervisoremail: req.user.username })
        .then((shipment) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(shipment);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else if (!req.user.admin) { //client and his own shipments with the allowed fields
        Shipments.find({ _id: req.params.shipmentId, clientemail: req.user.username })
        .then((shipment) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(shipment);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /shipments/'+ req.params.shipmentId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    if (req.user.admin == true) { //only admin can modify, only his shipments
        Shipments.findOneAndUpdate({ _id: req.params.shipmentId, supervisoremail: req.user.username }, {
            $set: req.body
        }, { new: true })
        .then((shipment) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(shipment);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Authentication ERROR: ' + req.user + ' not admin');
        err.status = 404;
        return next(err);
    }(err) => next(err)
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    if (req.user.admin == true ) { //only admin can delete, only his shipments
        Shipments.findOneAndRemove({ _id: req.params.shipmentId, supervisoremail: req.user.username })
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Authentication ERROR: ' + req.user + ' not admin');
        err.status = 404;
        return next(err);
    }(err) => next(err)
    .catch((err) => next(err));
});

// ================================UPDATES=======================================

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
.post(authenticate.verifyUser,(req, res, next) => {
    Shipments.findById(req.params.shipmentId)
    .then((shipment) => {
        req.body.Number = shipment.updates.length + 1;
        if (shipment != null) {
            shipment.updates.push(req.body);
            shipment.save()
            .then((shipment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shipment);
            }, (err) => next(err))
            .catch((err) => next(err));
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