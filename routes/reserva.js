"use strict"

var express = require('express');
var router = express.Router();
var firebase = require('firebase');

var materialListRef = firebase.database().ref("materialReserva/lista");

router.get("/getMaterialList", (req,res)=>{
  materialListRef.once("value", (data)=>{
    let materialList = [], materialKeys;
    materialKeys = Object.keys(data.val());
    materialKeys.map((current)=>{
      materialList.push(data.val()[current])
    });
    res.send({
      dados: materialList,
      keys: materialKeys
    });
  },(err)=> {console.log(err)
  }); 
});

router.post("/newListItem", function(req,res){
  var newID = materialListRef.push(req.body);
  res.send({
    newData : req.body, 
    key: newID.key
  });
});

router.post("/editListItem", function(req,res){
  var editId = req.body.id;
  materialListRef.child(editId).set(req.body.dados);
  res.send({
    newData: req.body.dados, 
    key: editId
  });
});

router.delete('/removeListItem', function(req, res) {
  var listDeleteId = req.body.id;
  materialListRef.child(listDeleteId).remove();
  res.send({
    msg:"O seu registo foi eliminado com sucesso"
  });
});


module.exports = router;
