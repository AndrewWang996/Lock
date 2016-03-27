var zerorpc = require("zerorpc");
var mongoose = require("mongoose");
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');


var userController = require('./controllers/user');
var userModel = require('./model/userModel');

var app = express();
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/**
 * Set up environment variables
 */
var env = {
    MONGODB: "mongodb://localhost:27017/dfa",
    MONGOLAB_URI: "mongodb://localhost:27017/dfa"
};

/**
 * Connect mongoose to Mongo server
 */
mongoose.connect(env.MONGODB || env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});


/**
 * Default port for web server
 */
var expressPort = 3000;

app.get('/', function(req, res) {
    res.render('registration', {
        'name': 'testing this application registration page'
    });
});
app.get('/database', userController.allUsers);
app.post('/user/register', userController.registerUser);
app.post('/user/clear', userController.clearUsers);

app.listen(expressPort, function() {
    console.log('Example app listening on port 3000');
})


/**
 * Default port for ZeroRPC communications
 */
var zerorpcPort = 4242;

var server = new zerorpc.Server({
    hello: function(name, reply) {
        reply(null, "Hello, haha andy was here" + name, false);
    },
    authenticate: function(code, reply) {
        userModel.authenticateUser(code).then(function(result) {
            reply(null, result, false);
        });
    }
});

server.bind("tcp://0.0.0.0:" + zerorpcPort);

