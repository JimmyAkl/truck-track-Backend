const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const productSchema = new Schema({
    productId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true

    },
    description: {
        type: String,
        required: true
    }


},{
    timestamps: true
});

var Products = mongoose.model('Product', productSchema);

module.exports = Products;