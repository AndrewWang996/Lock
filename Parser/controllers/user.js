
var userModel = require('../model/userModel');

exports.allUsers = function(req, res) {

    userModel.allUsers().then(function(users) {
        res.render('userinfo', {
            allUsers: users
        });
    })
}

exports.registerUser = function(req, res) {
    var first = req.body.firstName;
    var last = req.body.lastName;
    var mobile = req.body.mobile;
    var home = req.body.home;


    userModel.registerUser(first, last, mobile, home);

    res.redirect('back');
}

// function(code)
exports.deleteUser = function(req, res) {
    var code = req.body.code;

    userModel.deleteUser(code);

    res.redirect('back');
}

exports.authenticateUser = function(req, res) {
    var code = req.body.code;

    userModel.authenticateUser(code);

    res.redirect('back');
}

exports.clearUsers = function(req, res) {
    userModel.deleteUser( userModel.REMOVE_ALL_KEYWORD );

    res.redirect('back');
}