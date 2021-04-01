var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        //required: true
        default: ''
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
