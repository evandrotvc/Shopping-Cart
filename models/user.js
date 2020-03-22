var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

var userSchema = new Schema({
    email: {type: String , required:true},
    password: {type: String , required : true}

})

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5) , null) // 5 = numero de rounds
}

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password) // compara senha digitada com a senha armazenada no banco
}

module.exports  = mongoose.model('User' , userSchema)