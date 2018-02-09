var firebase = require('firebase');
var auth = firebase.auth();
var express = require('express');
var router = express.Router();
var logResponse;



// LOGIN

router.post("/login", function(req, res) {
  var email = req.body.email;
  var pass = req.body.password;
  var promise = auth.signInWithEmailAndPassword(email, pass);
  promise
    .then(function(user) {
      res.send({
        error: false
      });
    })
    .catch(function(error) {
      res.send({
        error: true,
        "msg": error.message
      });
    });
});



router.post("/logout", function(req, res) {
  firebase.auth().signOut();
  res.redirect('log/login.html');
});

module.exports = {
  isAuthenticated: function(req, res, next) {
    var user = firebase.auth().currentUser;
    if (user !== null) {
      next();
    } else {
      res.redirect('log/login.html');
    }
  },
  "router": router
}
