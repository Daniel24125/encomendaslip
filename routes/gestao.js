"use strict"

let express = require('express');
let router = express.Router();
let firebase = require('firebase');

let projectsRef = firebase.database().ref("gestãoLIP");

router.get("/getProjectsInfo", (req, res) => {
  projectsRef.once("value", (data) => {
    res.send({
      data: data.val()
    })
  }, (err) => {
    console.log(err)
  });
});

var ref = firebase.database().ref("registoLIP");
router.post("/projectStats", (req, res) => {
  let totalCabimentado = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalFaturado = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ref.orderByChild("fundo").equalTo(req.body.project).once("value", (snap) => {
    var queryData = snap.val();
    if(queryData != null){
      totalCabimentado.map((value, month) => {
        Object.keys(queryData).map((order) => {
          if (queryData[order].pedidoMes == month + 1 && queryData[order].pedidoAno == req.body.year && queryData[order].cabimentado != "") {
            totalCabimentado[month] += parseFloat(queryData[order].cabimentado);
          }
          if (queryData[order].pedidoMes == month + 1 && queryData[order].pedidoAno == req.body.year && queryData[order].estado == "Anulado") {
            totalCabimentado[month] -= parseFloat(queryData[order].cabimentado);
          }
          if (queryData[order].pedidoMes == month + 1 && queryData[order].pedidoAno == req.body.year && queryData[order].estado == "Feito") {
            totalCabimentado[month] -= (parseFloat(queryData[order].dif));
          }
          //Calculo de total faturado por mes
          if (queryData[order].faturaMes == month + 1 && queryData[order].faturaAno == req.body.year && queryData[order].faturado != "") {
            totalFaturado[month] += parseFloat(queryData[order].faturado);
          }
        });
      });
    }

    res.send({
      cabimentoAnual: totalCabimentado,
      faturadoAnual: totalFaturado
    })
  });

});

router.post("/addNewProject", (req, res)=>{
  let receivedData = req.body; 

  projectsRef.child(receivedData.nomeProjeto).update({
    OrcTotal : receivedData.OrcTotal, 
    OrcTotalDisp: receivedData.OrcTotalDisp,
    DataInicio: receivedData.DataInicio,
    DataFim: receivedData.DataFim
  });
  projectsRef.child(receivedData.nomeProjeto)
    .child(receivedData.anoProjeto)
    .child("plafonds").set({
      PlafondAtribuido: receivedData.PlafondAtribuido,
      PlafondDisp: receivedData.PlafondDisp
    })
  res.send({msg:"Success"})
});

router.delete("/deleteProject", (req, res)=>{
  let id = req.body.id; 
  projectsRef.child(id).remove()
  res.send({msg:"Success"})
});

module.exports = router;
