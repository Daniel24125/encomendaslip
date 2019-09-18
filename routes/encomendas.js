"use strict"

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

router.delete("/removeOrder", (req, res) => {
  let id = req.body.id
  ref.child(id).remove();
  res.send({
    msg: "A encomenda foi removida com sucesso"
  });
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
    data: receivedData[receivedNome]
  });
});

router.delete("/removeFornecedor", (req, res) => {
  let fornecedorNome = req.body.fornecedorName;
  fornecedores.child(fornecedorNome).remove();
  res.send({
    msg: "O fornecedor foi removido com sucesso"
  });
});

// GESTÃO DE CRÉDITOS

let credRef = firebase.database().ref("gestãoLIP/Crédito");

router.get("/getCred", (req, res) => {
  let creditos, sendCreditosData = {};
  credRef.once("value", function (data) {
    creditos = data.val();
  }, function (err) {
    console.log(err);
  });
  
 ref.once("value", (snap) => {
    let queryData = snap.val();
    let d = new Date().getTime();
    let currentDateYear = d.getFullYear();
    if(queryData != null){
      Object.keys(creditos).map((value) => {
        let credTs = creditos[value][3], offsetCredMes = creditos[value][1], offsetCredAno = creditos[value][2], realCredValue = creditos[value][0];
        Object.keys(queryData).map((order) => {
          let pedido_data_ts = getTimestamp(queryData[order].data)
          // if (queryData[order].fornecedor == value && queryData[order].fundo == "Crédito" && ((queryData[order].pedidoMes >= offsetCredMes && queryData[order].pedidoAno == currentDateYear) || queryData[order].pedidoAno > offsetCredAno)) {
          if (queryData[order].fornecedor == value && queryData[order].fundo == "Crédito" && pedido_data_ts > credTs) {  
            realCredValue -= parseFloat(queryData[order].faturado)
          }
          // if (queryData[order].fornecedor == value && queryData[order].pedidoCredito == "Sim" && ((queryData[order].pedidoMes >= offsetCredMes && queryData[order].pedidoAno == currentDateYear) || queryData[order].pedidoAno > offsetCredAno)) {
          if (queryData[order].fornecedor == value && queryData[order].pedidoCredito == "Sim" && pedido_data_ts > credTs) {        
            realCredValue += parseFloat(queryData[order].faturado);
          }
        });
        sendCreditosData[value] =realCredValue.toFixed(2);
      });
    }
    res.send(sendCreditosData)
  });
});


let getTimestamp = (date)=>{
    let newDate = date.split("/");    
    return new Date(`${newDate[2]}-${newDate[1]}-${newDate[0]}`).getTime()
}

router.post("/saveCredito", function (req, res) {
  let d = new Date();
  let ts = d.getTime();
  let currentDateYear = d.getFullYear();
  let currentDateMes = d.getMonth() + 1;
  credRef.child(req.body.name).set([
    req.body.value,
    currentDateMes,
    currentDateYear, 
    ts])
  res.send({
    msg: "Os seus dados foram alterados com sucesso!",
    name: req.body.name,
    value: req.body.value
  });
});


router.delete("/removeCred", function (req, res) {
  credRef.child(req.body.cred).remove();
  res.send({
    msg: "O crédito foi removido com sucesso"
  });
});


module.exports = router;
