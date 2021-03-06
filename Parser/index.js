var zerorpc = require("zerorpc");
var mongoose = require("mongoose");


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
 * final constant variables
 */
var defaultCodeLength = 6;

/**
 * Schemas
 *  - user schema
 *  -
 */
var userSchema = mongoose.Schema({	
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	mobile: {
		type: String,
		validator: function(v) {
			return /\d{3}-\d{3}-\d{4}/.test(v);
		}, 
		message: '{VALUE} is not a valid phone number!'
	},
	home: {
		type: String,
		validator: function(v) {
			return /\d{3}-\d{3}-\d{4}/.test(v);
		}, 
		message: '{VALUE} is not a valid phone number!'
	},
	code: {
		type: String,
		unique: true,
		required: true,
		validator: function(v) {
			return v.length == 6;
		},
		message: 'user code {VALUE} must have exactly 6 characters'
	}
});

var userModel = mongoose.model("User", userSchema);


/**
 * Generate random digit code of length "defaultCodeLength"
 */
var generateCode = function(length) {
	length = length || defaultCodeLength;
	var digits = "0123456789";
	var text = "";
	for(var i=0; i<length; i++) {
		text += digits[Math.floor(Math.random() * digits.length)];
	}
	return text;
}

/**
 * Insert users
 */
var insertUser = function(first, last, mobile, home) {

    console.log(userModel.collection);

    userModel.find({}, function(error, count) {
        console.log("all users: " + count);
    });

	userModel.collection.insertOne({
		firstName: first,
		lastName: last,
		mobile: mobile,
		home: home,
		code: generateCode()
	});
}

/**
 * Delete users
 */
var REMOVE_ALL_KEYWORD = "ALL";
var deleteUser = function(code) {
    if(code === REMOVE_ALL_KEYWORD) {
        return userModel.remove({});
    }
    else {
        return userModel.remove({code: code}, function(error, result) {
            if(error) {
                console.log(error);
            }
        });
    }
}

/**
 * Authenticate users
 */
var authenticateUser = function(code) {
    return userModel.findOne({code: code}).then(function(user) {
        return user != null;
    });
}


/*
// testing authentication
authenticateUser("985453").then(function(result) {
    console.log(result);
});
authenticateUser("079065").then(function(result) {
    console.log(result);
});
*/


var server = new zerorpc.Server({
    hello: function(name, reply) {
        reply(null, "Hello, haha andy was here" + name, false);
    },
    authenticate: function(code, reply) {
        authenticateUser(code).then(function(result) {
            reply(null, result, false);
        });
    }
});

server.bind("tcp://0.0.0.0:4242");

