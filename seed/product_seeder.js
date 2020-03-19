var Product = require('../models/products')
var mongoose = require('mongoose')
//var mongoclient = require('mongodb').Mongoclient
mongoose.connect('mongodb://localhost:27017/shopping' , { 
    useNewUrlParser: true ,
    useUnifiedTopology: true

})

var products = [    
    new Product({
        imagePath:"https://s3.amazonaws.com/comparegame/thumbnails/39560/large.jpg",
        "title": 'Uncharted 4',
        description: 'Jogo de ação , aventura com Nathan Drake',
        price: 15
    }),
    
    new Product({
        imagePath:"https://images.tcdn.com.br/img/img_prod/621461/the_last_of_us_remasterizado_ps4_140_1_20190319125127.jpg",
        title: 'The Last of Us',
        description: 'Jogo de Terror,aventura,Sobrevivência',
        price: 35
    }),
    new Product({
        imagePath:"https://s3.amazonaws.com/comparegame/thumbnails/42666/large.jpg",
        title: 'The Last of Us 2',
        description: 'Jogo de Terror,aventura,Sobrevivência',
        price: 70
    }),
    new Product({
        imagePath:"https://images-na.ssl-images-amazon.com/images/I/815TEngwF7L._AC_SX466_.jpg",
        title: 'Spider Man',
        description: 'Jogo de aventura,ação,super-herói, MarvelComics',
        price: 40
    }),

    new Product({
        imagePath:"https://s3.amazonaws.com/comparegame/thumbnails/41639/large.jpg",
        title: 'Final Fantasy VII',
        description: 'Jogo de aventura,ação,RPG',
        price: 90
    }),

    new Product({
        imagePath:"https://images-na.ssl-images-amazon.com/images/I/81ycgg1aviL._AC_SX342_.jpg",
        title: 'Death Stranding',
        description: 'Jogo de aventura,RPG, SCI-FI. Melhor Jogo !!!',
        price: 85
    })
]
const tamanho = products.length
//console.log( vet)
//console.log(products)

var done = 0;
for(var i =0 ; i < tamanho ; i++){
    products[i].save(function(err, results){
        done++
        if (done === tamanho){
            exit()
        }
    })
}

function exit(){
    mongoose.disconnect()    
}


