var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Shipments = require('./shipments');


var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    },
    shipments: [Shipments.schema]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);