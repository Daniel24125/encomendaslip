$(document).ready(function () {
      let projNames, projData;
      fetch('/getProjectsInfo')
        .then(response => response.json())
        .then(res => {
          $(".loader").addClass("hideComponent")
          projNames = Object.keys(res.data);
          projData = res.data;
          let years
          projNames.map((item, index) => {
            if (item != "Crédito") {
              let currentProj = projData[item];
              years = Object.keys(currentProj);
              years.splice((Object.keys(currentProj).length - 4), Object.keys(currentProj).length)
              years = years.reverse()
              $(".cardOverflowContainter").append(`
                <div ids="${item}" class="card">
                <div class="yearsContainer">                  
                </div>
                <span class="projectTitle">${item}</span>
                <div class="dataContainer">
                  <span class="dataInicio">${currentProj.DataInicio}</span> -
                  <span class="dataFim">${currentProj.DataFim}</span>
                </div>
                <div class="infoContainer">
                  <div title="Orçamento Total" class="cardInfoContainer">
                    <span class="infoCategory">OT: </span>
                    <span class="otValue">${currentProj.OrcTotal}</span>€
                  </div>
                  <div title="Orçamento Total Disponível" class="cardInfoContainer">
                    <span class="infoCategory">OTD: </span>
                    <span class="otdValue">${currentProj.OrcTotalDisp}</span>€
                  </div>
                  <div title="Plafond Anual Atribuído" class="cardInfoContainer">
                    <span class="infoCategory">PAA: </span>
                    <span class="otdValue">2413.92</span>€
                  </div>
                </div>
                <div class="cardFooterContainer">
                  <span class="carregarDados">DADOS</span>
                  <span class="editProject">EDITAR</span>
                </div>
              </div>
           
                `);
            }
          });
          $(".cardOverflowContainter").css("width", `${300*$(".card").length}px`)
          years.map((y) => {
            $(".yearsContainer").append(`
                <span class="year">${y}</span>
              `);
          });
          $(".year:first-child").addClass("activeYear")

        });

      $("body").on("click", ".year", function () {
        $(this).parent().children().removeClass("activeYear");
        $(this).addClass("activeYear")
      });


      // GRAFICO
      var ctx = document.getElementById('statsChart').getContext('2d');
      var myBarChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            datasets: [{
                label: "Cabimentado",
                backgroundColor: "#2850a7",
                data: [10000, 100, 200, 500, 1000, 4000, 10000, 100, 200, 500, 1000, 4000]
              },
              {
                label: "Faturado",
                backgroundColor: "#2ecc71",
                data: [10000, 100, 200, 500, 1000, 4000, 10000, 100, 200, 500, 1000, 4000]
              }
            ]
            },
            options: {
              legend: {
                display: false
              },
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });

          myBarChart.data.datasets[0].data = [12000, 11000, 10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000]
          myBarChart.update()
      });