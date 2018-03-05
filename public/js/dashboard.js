$(document).ready(function () {
  let pedidosEstados;
  let projectStats;
  fetch('/getEstadosStats', {
    credentials: 'include'
  })
    .then(response => response.json())
    .then(res => {
      pedidosEstados = res;
      Object.keys(res).map((estado) => {
        $(`#${estado} .numStats`).html(Object.keys(res[estado]).length)
      });
    });
  let chartColors = [
    "#1abc9c", 
    "#e67e22",
    "#16a085",
    "#2c3e50",
    "#2ecc71",
    "#27ae60",
    "#d35400",
    "#3498db",
    "#f39c12",
    "#2980b9",
    "#e74c3c",
    "#c0392b",
    "#34495e",
    "#f1c40f"
  ];
  let ctx = document.getElementById('statsChart').getContext('2d');
  let myDonutChart = new Chart(ctx, {
    type: 'doughnut',
    options: {
      legend: {
        display: false
      }
    }
  });
  fetch('/getProjectStats', {
    credentials: 'include'
  })
    .then(response => response.json())
    .then(res => {
      projectStats = res;
      myDonutChart.data.datasets = [{
        data: res.statistics,
        backgroundColor: chartColors.slice(0, res.statistics.length)
      }]
      myDonutChart.data.labels = res.projectNames
      myDonutChart.update();
      $(".mostUsedValue").html(Math.max(...res.statistics))
      $(".mostUsedName").html(res.projectNames[res.statistics.indexOf(Math.max(...res.statistics))])
      $(".loader").addClass("hideComponent");
      while(res.timestamp.indexOf(null) > 0){
        res.timestamp[res.timestamp.indexOf(null)] = new Date("2050-12-31").getTime()
      }
      let projectNearEnd = res.fullDate[res.timestamp.indexOf(Math.min(...res.timestamp))]    
    });



  let selectedCard, pedidosListOpen = false
  $(".estadoCard").click(function () {
    let dados;
    if (pedidosListOpen == true && $(this).children(".statsContainer").children("p").children().hasClass("rotate")) {
      closePedidoInfo();
    } else if (pedidosListOpen == true && $(this).children(".statsContainer").children("p").children().hasClass("rotate") == false) {
      closePedidoInfo();
      selectedCard = $(this).attr("id");
      dados = pedidosEstados[selectedCard]
      setTimeout(function () {
        openPedidoInfo($(`#${selectedCard}`), dados);
      }, 300);
    } else {
      selectedCard = $(this).attr("id");
      dados = pedidosEstados[selectedCard]
      openPedidoInfo($(`#${selectedCard}`), dados);

    }
  });

  $(".closePedido").click(function () {
    closePedidoInfo();
  });

  let closePedidoInfo = () => {
    pedidosListOpen = false
    $(".statsContainer p").children().removeClass("rotate")
    $(".pedidosListContainer").addClass("heightZero");
    $("#tabelaPedidos").html("")
  }

  let openPedidoInfo = (el, data) => {
    pedidosListOpen = true
    el.children(".statsContainer").children("p").children().addClass("rotate")
    $(".pedidosListContainer").removeClass("heightZero");
    Object.keys(data).map((item) => {
      let notaEncomenda = ` <th class="cell">${data[item].notaEncomenda}</th>`
      let numPedido = `<th class="cell">${data[item].pedido}</th>`;

      if (data[item].notaEncomenda.length >= 20) {
        notaEncomenda = `<th title="${data[item].notaEncomenda}" class="cell">${data[item].notaEncomenda.slice(0,15) + "..."}</th>`
      }

      if (data[item].pedido.length >= 20) {
        numPedido = `<th title="${data[item].pedido}" class="cell">${data[item].pedido.slice(0,15) + "..."} </th>`
      }

      $("#tabelaPedidos").append(`
        <tr id="${item}">
          <th class="cell">${data[item].data}</th>
          <th class="cell">${data[item].remetente}</th>
          ${numPedido}
          <th class="cell">${data[item].fornecedor}</th>
          ${notaEncomenda}
          <th class="cell">${data[item].fundo}</th>
          <th class="cell">${data[item].cabimentado}</th>
          <th class="cell">${data[item].faturado}</th>
         </tr>
        `);
    });
  }



});