var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new mongoose.Schema({
    //user: {type: Schema.Types.ObjectId , ref: 'User'}, req.user
    cart: {type: Object , required: true},
    //name: {type: String , required: true}, // req.body.name , field in form
    paymentId: {type: String , required: true}

})

module.exports = mongoose.model('Order' , schema)