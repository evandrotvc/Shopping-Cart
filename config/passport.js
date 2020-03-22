/**
 * criar autenticação com usuário e senha no MongoDB em aplicações web Node.js 
 * com Passport.
 */

 var passport = require('passport')
 var User = require('../models/user')
 var LocalStrategy = require('passport-local').Strategy
 const { check, validationResult } = require('express-validator');

 passport.serializeUser(function(user , done) {
    done(null , user.id)
 })

 passport.deserializeUser(function(id , done){
     User.findById(id ,function(err , user){ // procura no banco 
         done(err,user) // se encontrado chame done 
     })

 })

 passport.use('local.signup' , new LocalStrategy({
     usernameField: 'email',
     passwordField: 'password',
     passReqToCallback: true
 } , function(req, email , password, done) {
    /* req.checkBody('email' , 'invalid email' ).notEmpty().isEmail()
     req.checkBody('password', 'invalid password' ).notEmpty().isLenght({min: 4})
     var errors = req.validationErrors()
     if(errors){
         var messages = []
         errors.forEach(function(error){
             messages.push(error.msg)
         })
         return done(null , false , req.flash('error', messages))
     }*/
    User.findOne({'email' : email }, function(err, user){
        if(err){ // ação mal sucedida , não encontrado
            return done(err)
        }
        if(user){ // operação bem sucedido            
            return done(null , false, {message: 'Email is already in use.'})
        }
        var newUser = new User()
        newUser.email = email
        newUser.password = newUser.encryptPassword(password)
        newUser.save(function(err, result){
            if(err){
                return done(err)
            }
            return done(null , newUser)
        })
    })
 }))
// manage operations in page signin 
 passport.use('local.signin' , new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
 }, function(req, email , password, done) {

    
    User.findOne({'email' : email }, function(err, user){
        if(err){ // ação mal sucedida , não encontrado
            return done(err)
        }
        if(!user){ // operação bem sucedido            
            return done(null , false, {message: 'no user found.'})
        }
        if(!user.validPassword(password)){
            return done(null , false, {message: 'wrong password.'})
        }
       return done(null , user)
    })
 }))