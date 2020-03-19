var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars')
var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var mongoose = require('mongoose')

var app = express();

//mongoose.connect('localhost:27017/shopping')
mongoose.connect('mongodb://localhost:27017/shopping' , 
{ 
  useNewUrlParser: true ,
  useUnifiedTopology: true

})

/* Cria coleções Product no database shopping
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/shopping";

MongoClient.connect(url, { useUnifiedTopology: true } ,function(err, db) {
  if (err) throw err;
  var dbo = db.db("shopping");
  dbo.createCollection("Product", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
});
})*/


// view engine setup
app.engine('.hbs' , expressHbs({defaultLayout: 'layout' , extname: '.hbs' }))
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
