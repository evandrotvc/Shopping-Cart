var express = require('express');
var router = express.Router();
var Product = require('../models/products')

/* GET home page. */
router.get('/', function(req, res, next) {
  var products = Product.find() // mostra todos os dados no banco
  res.render('shop/index', { title: 'Shopping Cart xD' , products: products}); // renderezia index.hbs
});

module.exports = router;
