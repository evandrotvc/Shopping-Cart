var express = require('express');
var router = express.Router();

var Product = require('../models/products')

/* GET home page. Docs guarda todos os dados do banco de dados */
router.get('/', function(req, res, next) {
   Product.find(function(err , docs){
    var productChunks = []
    var chunkSize = 3
    var produtos_size = docs.length
    for(var i =0 ; i< produtos_size; i+= chunkSize){
      productChunks.push(docs.slice(i , i + chunkSize))
    }
    res.render('shop/index', { title: 'Shopping Cart xD' , products: productChunks}); // productChunks é enviado para o layout da página
   }) 
  
});



module.exports = router;
