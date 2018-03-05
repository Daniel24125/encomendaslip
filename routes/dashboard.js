"use strict"

var express = require('express');
var router = express.Router();
var firebase = require('firebase');

var stats = firebase.database().ref("registoLIP");

let estados = ["Encomendado", "Pendente", "Cabimento_pedido", "Anulado"];
let estadosPromises = [];
let projectsPromises = [];
let projectsList = firebase.database().ref("gestãoLIP");
let sendProjectStats  = {};
let sendEstadoData = {}

router.get("/getEstadosStats", (req, res) => {
    estados.map((est) => {
        estadosPromises.push(
            stats.orderByChild("estado").equalTo(est).once("value")
            .then(snap => {
                var result = snap.val();
                if (result != null) {
                    sendEstadoData[est] = result
                }
            })
        )
    });

    Promise.all(estadosPromises).then(() => {
        res.send(sendEstadoData)
    });
});

router.get("/getProjectStats", (req,res)=>{
    projectsList.once("value", (data) => {
        sendProjectStats.projectNames = [];
        sendProjectStats["statistics"] = [];
        sendProjectStats["fullDate"] = []
        sendProjectStats["timestamp"] = []
        Object.keys(data.val()).map((name) => {
            projectsPromises.push(stats.orderByChild("fundo").equalTo(name).once("value")
                .then(snap => { 
                    var projectsQuery = snap.val();
                    if (projectsQuery != null && name != "Crédito") {
                        sendProjectStats.projectNames.push(name);
                        sendProjectStats["statistics"].push(Object.keys(projectsQuery).length);
                        sendProjectStats["fullDate"].push(data.val()[name].DataFim) 
                        sendProjectStats["timestamp"].push(getTimestamp(data.val()[name].DataFim))
                    }
                    
                })
            );
        });
        Promise.all(projectsPromises).then(() => {
            res.send(sendProjectStats)
        });
    });
    
});

let getTimestamp = (date)=>{
    let newDate = date.split("/");    
    return new Date(`${newDate[2]}-${newDate[1]}-${newDate[0]}`).getTime()
}

module.exports = router;