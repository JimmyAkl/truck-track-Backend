const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Updates = require('./update');

const shipmentSchema = new Schema({
    ID: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    supervisoremail: {
        type: String,
    },
    supervisornumber: {
        type: String,
        required: true
    },
    clientemail: {
        type: String,
        required: true
    },
    clientnumber: {
        type: String,
        required: true
    },
    startlocation: {
        type: String,
        required: true
    },
    endlocation: {
        type: String,
        required: true
    },
    expectedDeparture: {
        type: Date,
        required:true
    },
    expectedArrival: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: ''
    },
    temperature: {
        type: String,
        default: ''
    },
    vibration: {
        type: String,
        default: ''
    },
    humidity: {
        type: String,
        default: ''
    },
    updates: [Updates.schema]
},{
    timestamps: true
});

var Shipments = mongoose.model('Shipments', shipmentSchema);

module.exports = Shipments;