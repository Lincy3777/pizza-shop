//table in the db. model is singular, table(collection) is plural. i.e, menu here is menus there

const mongoose = require('mongoose')
const Schema = mongoose.Schema; //class/constructor will be saved here
const user = require('./user');

const orderSchema = new Schema({//no raw data only paths
    customerId:{
    type: mongoose.Schema.Types.ObjectId,//relation of order collection with user collection(table)
    ref:'User',//the user relation
    required: true
    },
    items: { type: Object, required: true},
    phone: { type: String, required: true},
    address: { type: String, required: true},
    paymentType: { type: String, default: 'COD'},
    paymentStatus:{ type: Boolean, default: false},
    status:  { type: String, default: 'Order_placed'},
},{timestamps: true})//created at , updated at


module.exports = mongoose.model('order', orderSchema)//name of table, in the schema

