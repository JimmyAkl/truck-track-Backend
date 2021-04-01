const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var adminSchema = new Schema({
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;