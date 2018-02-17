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

router.get('/getData', (req, res) => {
  let receivedData = [],
  keys;
  ref.once("value", (data) => {
    keys = Object.keys(data.val());
    keys.map(key => receivedData.push(data.val()[key]))
    let numElements = parseInt(req.query.num);
    let length = keys.length;
    let sendData = receivedData.slice(length - (numElements + 30), length - numElements)
    let sendKeys = keys.slice(length - (numElements + 30), length - numElements)
    res.send({
      "keys": sendKeys,
      "data": sendData
    });
      
  },
  (err) => console.log(err));
});

// SEARCH ORDER
router.post("/searchOrder", function (req, res) {
  console.log(req.body.search, req.body.field);
  ref.orderByChild(req.body.field).startAt(req.body.search).endAt(req.body.search + "\uf8ff").once("value", (snap) => {
    var queryData = snap.val();
    if (queryData != null) {
      var searchKeys = Object.keys(queryData);
      var sendData = [];
      searchKeys.map(function (key) {
        sendData.push(snap.val()[key]);
      });
      res.send({
        error: false,
        searchData: sendData,
        keys: searchKeys
      });
    } else {
      res.send({
        error: true,
        msg: "Não foi encontrado nenhum registo"
      });
    }
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
  let key = ref.push(req.body);
  res.send({
    msg: "O seu registo foi adicionado com sucesso",
    newData: {
      key: key.key, 
      data: req.body
    }
  });
});

router.post('/editOrder', (req, res) => {
  ref.child(req.body.id).set(req.body.editData)
  res.send({
    msg: "O seu registo foi editado com sucesso",
    newData: req.body.editData
  });
});

router.delete("/removeOrder",(req, res)=>{
  let id = req.body.id
  ref.child(id).remove();
  res.send({
    msg:"A encomenda foi removida com sucesso"});
});

//GESTÃO DE FORNECEDORES
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