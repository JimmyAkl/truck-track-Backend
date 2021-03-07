const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var updateSchema = new Schema({
    Number:  {
        type: Number,
        required: true,
        default: 0
    },
    temperature:  {
        type: Number,
        required: true
    },
    vibration:  {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});


const shipmentSchema = new Schema({
    ID:{
        type:String,
        //required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    supervisor:{
        type:String,
        required:true

    },
    client:{
        type:String,
        required:true

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
    status:{
        type:String,
        required:true,
        default:''
    },
    temperature: {
        type: String,
        default:''
    },
    vibration: {
        type: String,
        default:''
    },
    humidity: {
        type: String,
        default:''
    },
    updates:[updateSchema]
},{
    timestamps: true
});

var Shipments = mongoose.model('Shipments', shipmentSchema);

module.exports = Shipments;