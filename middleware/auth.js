var firebase = require('firebase');
var auth = firebase.auth();
var express = require('express');
var router = express.Router();
var cookieParser = require("cookie-parser")
var logResponse;



// LOGIN

router.post("/login", function(req, res) {
  var email = req.body.email;
  var pass = req.body.password;
  auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
  .then(function() {
    return firebase.auth().signInWithEmailAndPassword(email, pass);
  }).then(function(){
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
  // var promise = auth.signInWithEmailAndPassword(email, pass);
  // promise
  //   .then(function(user) {
      
  //   })
  //   .catch(function(error) {
     
  //   });
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
