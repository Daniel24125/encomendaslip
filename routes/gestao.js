"use strict"

var express = require('express');
var router = express.Router();
var firebase = require('firebase');

var projectsRef = firebase.database().ref("gestãoLIP");

router.get("/getProjectsInfo", (req,res)=>{
  projectsRef.once("value", (data)=>{
    res.send({
      data: data.val()
    })
   },(err)=> {console.log(err)
   }); 
});


module.exports = router;
