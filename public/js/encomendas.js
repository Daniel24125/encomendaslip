$(document).ready(function () {
  $("#searchForm").submit((e) => {
    e.preventDefault();
  });
  let dumData = [{
      "cabimentado": "947.1",
      "data": "30/06/2016",
      "dataFatura": "06/07/16",
      "dif": 0,
      "estado": "Feito",
      "faturaAno": "2016",
      "faturaMes": "7",
      "faturaSecretaria": "Sim",
      "faturado": 947.1,
      "fornecedor": "VWR",
      "fundo": "ENROBEE",
      "notaEncomenda": "NE.001.2016.0015002",
      "notas": "Crédito",
      "pedido": "9002240648",
      "pedidoAno": 2016,
      "pedidoCredito": "Não",
      "pedidoMes": 6,
      "remetente": "",
      "rubrica": "Consumíveis e Reagentes"
    },
    {
      "cabimentado": "947.1",
      "data": "30/06/2016",
      "dataFatura": "06/07/16",
      "dif": 0,
      "estado": "Feito",
      "faturaAno": "2016",
      "faturaMes": "7",
      "faturaSecretaria": "Sim",
      "faturado": 947.1,
      "fornecedor": "VWR",
      "fundo": "ENROBEE",
      "notaEncomenda": "NE.001.2016.0015002",
      "notas": "Crédito",
      "pedido": "9002240648",
      "pedidoAno": 2016,
      "pedidoCredito": "Não",
      "pedidoMes": 6,
      "remetente": "",
      "rubrica": "Consumíveis e Reagentes"
    }
  ];

  dumData.map((item)=>{
    console.log(item)
  });
});