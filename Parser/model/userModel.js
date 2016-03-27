var mongoose = require('mongoose');


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
            return v.length == defaultCodeLength;
        },
        message: 'user code {VALUE} must have exactly 6 characters'
    }
});
exports.userSchema = userSchema;

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
exports.registerUser = function(first, last, mobile, home) {

    userModel.find({}, function(error, count) {
        console.log("all users: " + count);
    });

    return userModel.collection.insertOne({
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
exports.REMOVE_ALL_KEYWORD = REMOVE_ALL_KEYWORD;

exports.deleteUser = function(code) {
    if(code === REMOVE_ALL_KEYWORD) {
        return userModel.collection.remove({});
    }
    else {
        return userModel.collection.remove({code: code}, function(error, result) {
            if(error) {
                console.log(error);
            }
        });
    }
}

/**
 * Authenticate users
 */
exports.authenticateUser = function(code) {
    return userModel.findOne({code: code}).then(function(user) {
        return user != null;
    });
}


exports.allUsers = function() {
    return userModel.find({});
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


