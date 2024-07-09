//table in the db. model is singular, table(collection) is plural. i.e, menu here is menus there

const mongoose =require('mongoose')
const Schema = mongoose.Schema //class/constructor will be saved here
const userSchema = new Schema({//no raw data only paths
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true },//to receive unique email id
    password: {type: String, required: true },
    role: {type: String, default: 'customer'},//customer will register by themselves, but we will created manually
},{timestamps: true})//created at , updated at

module.exports = mongoose.model('User',userSchema)//name of table, in the schema