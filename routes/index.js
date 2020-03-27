var express = require('express');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
var router = express.Router();
var Cart = require('../models/cart')
var Product = require('../models/products')
const Order = require('../models/order')

/* GET home page. Docs guarda todos os dados do banco de dados */
router.get('/', function(req, res, next) {
   var sucessMsg = req.flash('sucess')[0]
   Product.find(function(err , docs){
    var productChunks = []
    var chunkSize = 3
    var produtos_size = docs.length
    for(var i =0 ; i< produtos_size; i+= chunkSize){
      productChunks.push(docs.slice(i , i + chunkSize))
    }
    res.render('shop/index', { title: 'Shopping Cart xD' , products: productChunks , sucessMsg: sucessMsg , noMessages: !sucessMsg}); // productChunks é enviado para o layout da página
   }) 
  
});

router.get('/add-to-cart/:id' , function(req, res , next){
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : { })

  Product.findById(productId , function(err, product){
    if(err){
      return res.redirect('/')
    }
    cart.add(product , product.id)
    req.session.cart = cart
    console.log(req.session.cart)
    res.redirect('/')
  })
})

// reduce in one , items in the cart
router.get('/reduce/:id' , function(req,res,next){
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : { })
  // reducebyone declared in models/cart
  cart.reduceByOne(productId)
  req.session.cart = cart
  res.redirect('/shoppingCart')
})

// remove all items of the same items
router.get('/removeAll/:id' , function(req,res,next){
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : { })
  // reducebyone declared in models/cart
  cart.removeAll(productId)
  req.session.cart = cart
  res.redirect('/shoppingCart')
})


router.get('/shoppingCart' , function(req, res , next){
  if(!req.session.cart){
    return res.render('shop/shoppingCart' , {products : null })
  }
  var cart = new Cart(req.session.cart)
  res.render('shop/shoppingCart' , {products : cart.generateArray(), totalPrice: cart.totalPrice } )
})

router.get('/checkout' ,isLoggedIn ,function(req, res , next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart')
  }
  
  var cart = new Cart(req.session.cart)
  var errMsg = req.flash('error')[0]
  res.render('shop/checkout' , {total : cart.totalPrice , errMsg : errMsg , noErrors : !errMsg})
})



// route card credits
// param isloggedin ensured what user is logged , before to pay
router.post('/checkout' ,isLoggedIn ,async (req, res, next) => {
    if(!req.session.cart){
      return res.redirect('/shopping-cart')
    }
    
    var cart = new Cart(req.session.cart)
    const stripe = require('stripe')('sk_test_S1TPydzJg0lMWfdY8tj7gKrn00NKS1pqdV');
    console.log("reqq:" ,  req.body)
  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
const charge=  await stripe.charges.create(
    {
      amount: cart.totalPrice * 100,
      currency: 'usd',
     source: req.body.stripeToken ,
      description: 'Test Charge',
    },
    function(err, charge) {
      // asynchronously called
      if(err){
        // error: must provide source or custom error
        req.flash('error' , err.message )
        return res.redirect('/checkout')
      }
      // store order in mongoose
      var order = new Order({
        cart: cart,
        paymentId: charge.id
      })
      order.save(function(err, result){
        // finish bought , redirect localhost '/' with message sucess
        req.flash('sucess' , ' 🛍️ Sucessfully bought product!')
        req.cart = null 
        res.redirect('/')
      })
      /* finish bought , redirect localhost '/' with message sucess.
      req.flash('sucess' , ' 🛍️ Sucessfully bought product!')
      req.cart = null 
      res.redirect('/')*/
    }
  );
})
module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next()
  }
   req.session.oldUrl = req.url
   res.redirect('/user/signin')
   //alert("Login necessary for to pay")
}