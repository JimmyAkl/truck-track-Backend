const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    timestamps: true
});

var Orders = mongoose.model('Order', orderSchema);

module.exports = Orders;