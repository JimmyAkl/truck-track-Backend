const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var updateSchema = new Schema({
    Number:  {
        type: Number,
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

var Updates = mongoose.model('Updates', updateSchema);

module.exports = Updates;