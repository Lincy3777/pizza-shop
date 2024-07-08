//table in the db. model is singular, table(collection) is plural. i.e, menu here is menus there

const mongoose =require('mongoose')
const Schema = mongoose.Schema //class/constructor will be saved here
const menuSchema = new Schema({//no raw data only paths
    name: {type: String, required: true },
    image: {type: String, required: true },
    price: {type: Number, required: true },
    size: {type: String, required: true },
})//blueprint

module.exports = mongoose.model('Menu',menuSchema)//name of table, the schema