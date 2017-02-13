var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongo = require('mongodb'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://Olondea:olondea@ds159747.mlab.com:59747/usersdb');
var db = mongoose.connection;

//include routes
var routes = require('./routes/index');
var users = require('./routes/users');

//initialize App
var app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());


//express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//connect-Flash
app.use(flash());

//global variable for flash messages
app.use(function (req,res,next) {
    res.locals.success_msg =req.flash('success_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.error =req.flash('error');
    res.locals.user =req.user || null;
    next();
});

//middleware for route files
app.use('/',routes);
app.use('/users',users);

//set port
app.set('port',process.env.PORT || 2000);

//start server
app.listen(app.get('port'),function () {
    console.log('Server running on port ' + app.get('port'));
});