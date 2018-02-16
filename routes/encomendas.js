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
var receivedData = [],
  keys;
ref.on("value", (data) => {
    keys = Object.keys(data.val());
    keys.map(key => receivedData.push(data.val()[key]))
  },
  (err) => console.log(err));

router.get('/getData', (req, res) => {
  let numElements = parseInt(req.query.num);
  let length = keys.length;
  let sendData = receivedData.slice(length - (numElements + 30), length - numElements)
  let sendKeys = keys.slice(length - (numElements + 30), length - numElements)
  res.send({
    "keys": sendKeys,
    "data": sendData
  });
});

let projName = firebase.database().ref("gestãoLIP/");

router.get("/getProjectsNames", (req, res) => {
  projName.once("value", function (data) {
    res.send(Object.keys(data.val()));
  }, function (err) {
    console.log(err);
  });
});

router.post('/addNew', (req, res) => {
  // ref.push(req.body);
  console.log(req.body)
  res.send({
    msg: "O seu registo foi adicionado com sucesso"
  });
});

var fornecedores = firebase.database().ref("fornecedores");

router.get("/getFornecedores", (req, res) => {
  fornecedores.once("value", function (data) {
    res.send(data.val());
  }, function (err) {
    console.log(err);
  });
})

router.post('/addNewFornecedor', (req, res) => {
  let receivedData = req.body;
  let receivedNome = Object.keys(receivedData)[0]
  fornecedores
    .child(receivedNome)
    .set(receivedData[receivedNome])
  res.send({
    msg: "O fornecedor foi adicionado com sucesso",
    data : receivedData[receivedNome]
    });
});

router.delete("/removeFornecedor",(req, res)=>{
  var fornecedorNome = req.body.fornecedorName;
  fornecedores.child(fornecedorNome).remove();
  res.send({
    msg:"O fornecedor foi removido com sucesso"});
});

module.exports = router;