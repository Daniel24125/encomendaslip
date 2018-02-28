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

module.exports = router;



// for (let j = 0; j < totalCabimentado.length; j++) {
//   for (let i = 0; i < dados.length; i++) {
//     //Calculo de total cabimentado por mes
//     if (dados[i].pedidoMes == j + 1 && dados[i].pedidoAno == currentYear && dados[i].cabimentado != "") {
//       totalCabimentado[j] += parseFloat(dados[i].cabimentado);
//     }
//     if (dados[i].pedidoMes == j + 1 && dados[i].pedidoAno == currentYear && dados[i].estado == "Anulado" && dados[i].cabimentado != "") {
//       totalCabimentado[j] -= parseFloat(dados[i].cabimentado);
//     }
//     if (dados[i].pedidoMes == j + 1 && dados[i].pedidoAno == currentYear && dados[i].estado == "Feito" && dados[i].cabimentado != "") {
//       totalCabimentado[j] -= (parseFloat(dados[i].dif));
//     }

//     //Calculo de total faturado por mes
//     if (dados[i].faturaMes == j + 1 && dados[i].faturaAno == currentYear && dados[i].faturado != "") {
//       totalFaturado[j] += parseFloat(dados[i].faturado);
//     }
//   }
// }