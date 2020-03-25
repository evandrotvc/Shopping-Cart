var express = require('express');
var router = express.Router();
var Cart = require('../models/cart')
var Product = require('../models/products')

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

router.get('/shoppingCart' , function(req, res , next){
  if(!req.session.cart){
    return res.render('shop/shoppingCart' , {products : null })
  }
  var cart = new Cart(req.session.cart)
  res.render('shop/shoppingCart' , {products : cart.generateArray(), totalPrice: cart.totalPrice } )
})

router.get('/checkout' , function(req, res , next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart')
  }
  console.log("request0:" , req.body)
  var cart = new Cart(req.session.cart)
  var errMsg = req.flash('error')[0]
  res.render('shop/checkout' , {total : cart.totalPrice , errMsg : errMsg , noErrors : !errMsg})
})

// route card credits
router.post('/checkout' , async (req, res, next) => {
    if(!req.session.cart){
      return res.redirect('/shopping-cart')
    }
    
    var cart = new Cart(req.session.cart)
    const stripe = require('stripe')('your_secret_key');
    //const teste = req.body
    //console.log("req:" , this.req)
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
      req.flash('sucess' , ' 🛍️ Sucessfully bought product!')
      req.cart = null 
      res.redirect('/')
    }
  );
})
module.exports = router;
