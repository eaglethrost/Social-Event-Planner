var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var mysql = require('mysql');
var cons = require('consolidate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var connection = mysql.createPool({
    host: 'localhost',
    database: 'EventsPlanner'
});

app.use(function(req,res,next){
    req.pool = connection;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'thisissomesession',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
