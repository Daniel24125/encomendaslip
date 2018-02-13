var express = require('express');
var router = express.Router();
var firebase = require('firebase');
firebase.initializeApp({
  "apiKey": process.env.API_KEY,
  "authDomain": process.env.AUTH_DOMAIN,
  "databaseURL": process.env.DATABASE_URL,
  "projectId": process.env.PROJECT_ID,
  "storageBucket": process.env.STORAGE_BUCKET,
  "messagingSenderId": process.env.MESSAGING_SENDER_ID
});

var ref = firebase.database().ref("registoLIP");
var receivedData=[], keys;
ref.on("value", (data) => {
    keys = Object.keys(data.val());
    keys.map(key=>receivedData.push(data.val()[key]))
  },
  (err) => console.log(err));

router.get('/getData', (req, res) =>{
  let numElements = req.query.num;
  let length = keys.length;
  console.log(numElements)
  res.send({
    "keys": keys.slice(length-(numElements+30),length-numElements),
    "data": receivedData.slice(length-(numElements+30),length-numElements)
  });
});


module.exports = router;