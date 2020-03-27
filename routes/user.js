var express = require('express');
var router = express.Router();
const Order = require('../models/order')
const Cart = require('../models/cart')


var csrf = require('csurf')
var csurfProtection = csrf() // chave de segurança
router.use(csurfProtection)

var passport = require('passport')


router.get('/profile' ,isLoggedIn, function(req , res, next){
    Order.find({_id: "5e7c05bec79c909976666fb6"} , function(err,orders){ // orders é um array      
      if(err){
        return res.write('Error')
      }
      var cart 
      //console.log(orders)
      orders.forEach(function(order){ // percorre o items do cart.
        cart = new Cart(order.cart)
        order.items = cart.generateArray()
      })
      res.render('user/profile', { orders : orders})
    })  
  })

router.get('/logout' , isLoggedIn,function(req, res , next){
    req.logout()
    req.flash('success_msg', 'You are logged out');
    res.redirect('/')
})

router.use('/' ,notLoggedIn, function(req,res , next){
    next()
})

// page form signup
router.get('/signup' , function(req, res , next){
    var messages = req.flash('error')
    var lenght_msg = messages.length
    res.render('user/signup' , { csrfToken : req.csrfToken(), messages: messages , hasErrors: lenght_msg > 0 } )
  })
  
  router.post('/signup' , (req, res, next) => {
    passport.authenticate('local.signup', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/signup',
        failureFlash: true
      })(req, res, next)
       
  })
  
  
  router.get('/signin' , function(req, res , next){
    var messages = req.flash('error')
    var lenght_msg = messages.length
    res.render('user/signin' , { csrfToken : req.csrfToken(), messages: messages , hasErrors: lenght_msg > 0 } )
  
  })
  
  
  router.post('/signin' , (req, res , next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/signin',
        failureFlash: true
      })(req, res, next)
  })


  module.exports = router

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
     res.redirect('/')
  }

  function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next()
    }
     res.redirect('/')
  }

  