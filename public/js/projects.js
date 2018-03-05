$(document).ready(function () {
  let projNames, projData;
  fetch('/getProjectsInfo', {
    credentials: 'include'
  })
    .then(response => response.json())
    .then(res => {
      $(".loader").addClass("hideComponent")
      projNames = Object.keys(res.data);
      projData = res.data;
      let years
      projNames.map((item, index) => {
        if (item != "Crédito") {
          let currentProj = projData[item];
          years=[];
          years = Object.keys(currentProj);
          years.splice((Object.keys(currentProj).length - 4), Object.keys(currentProj).length);
          years = years.reverse()
          $(".cardOverflowContainter").append(`
                <div id="${item}" class="card">
                <div class="yearsContainer">                  
                </div>
                <span class="projectTitle">${item}</span>
                <div class="dataContainer">
                  <span class="dataInicio">${currentProj.DataInicio}</span> -
                  <span class="dataFim">${currentProj.DataFim}</span>
                </div>
                <div class="infoContainer">
                  <div class="statsNumbersContainer">
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
                      <span class="paaValue">${currentProj[years[0]].plafonds.PlafondAtribuido}</span>€
                    </div>
                  </div>
                  <div class="pad">
                    <div title="Plafond Anual Displonível" class="cardInfoContainer">
                      <span class="padValue">${currentProj[years[0]].plafonds.PlafondDisp}</span>€
                    </div>
                  </div>
                </div>
                <div class="cardFooterContainer">
                  <span class="carregarDados">DADOS</span>
                  <span class="editProject">EDITAR</span>
                  <span class="deleteProject">ELIMINAR</span>
                </div>
              </div>
           
                `);
                years.map((y) => {
                  $(`#${item}`).children(".yearsContainer").append(`
                          <span class="year">${y}</span>
                        `);
                });
                
        }
      });
      $(".year:first-child").addClass("activeYear");
      $(".card:first-child").addClass("activeCard")
      getStats($(".card:first-child").attr("id"), $(".card:first-child .activeYear").html())
      $(".cardOverflowContainter").css("width", `${300*$(".card").length}px`)
    });

  $("body").on("click", ".year", function () {
    $(this).parent().children().removeClass("activeYear");
    $(this).addClass("activeYear");
    let yearClicked = $(this).html()
    let yearOfProject = $(this).parents().eq(1).attr("id")
    $(`#${yearOfProject} .otdValue`).html(projData[yearOfProject].OrcTotalDisp)
    $(`#${yearOfProject} .paaValue`).html(projData[yearOfProject][yearClicked].plafonds.PlafondAtribuido)
    $(`#${yearOfProject} .padValue`).html(projData[yearOfProject][yearClicked].plafonds.PlafondDisp)
  });

  let selectedProjectID;
  $("body").on("click", ".deleteProject", function () {
   selectedProjectID = $(this).parents().eq(1).attr("id");
   $(".confirmDeleteContainer, .blackBackground").removeClass("hideComponent")
  });

  $(".cancelDelete").click(function(){
    $(".confirmDeleteContainer, .blackBackground").addClass("hideComponent")
  });

  $(".confirmDelete").click(function(){
    $(".confirmDeleteContainer, .blackBackground").addClass("hideComponent");
    fetch('/deleteProject', {
      method: 'delete',
      body: JSON.stringify({id:selectedProjectID}),
      headers: {
        'content-type': 'application/json'
      },
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      location.reload()
    });
  });

  $("body").on("click", ".carregarDados", function () {
    let selectedProject = $(this).parents().eq(1).attr("id"),
      selectedYear = $(this).parents().eq(1).find(".activeYear").html();
    console.log(selectedProject)
    $(".activeCard").removeClass("activeCard")
    $(this).parents().eq(1).addClass("activeCard")
    getStats(selectedProject, selectedYear);
  });

  $("body").on("click", ".editProject", function () {
    selectedProjectID = $(this).parents().eq(1).attr("id");
    $("#nomeProjeto").val(selectedProjectID).parent().addClass("inputFocus")
    $("#anoProjeto").val($(`#${selectedProjectID} .activeYear`).html()).parent().addClass("inputFocus")
    $("#DataInicio").val($(`#${selectedProjectID} .dataInicio`).html()).parent().addClass("inputFocus")
    $("#DataFim").val($(`#${selectedProjectID} .dataFim`).html()).parent().addClass("inputFocus")
    $("#OrcTotal").val($(`#${selectedProjectID} .otValue`).html()).parent().addClass("inputFocus")
    $("#OrcTotalDisp").val($(`#${selectedProjectID} .otdValue`).html()).parent().addClass("inputFocus")
    $("#PlafondAtribuido").val($(`#${selectedProjectID} .paaValue`).html()).parent().addClass("inputFocus")
    $("#PlafondDisp").val($(`#${selectedProjectID} .padValue`).html()).parent().addClass("inputFocus")
    $(".blackBackground, .addListItemContainer").removeClass("hideComponent")
    
  });

  let ctx = document.getElementById('statsChart').getContext('2d');
  let myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      datasets: [{
          label: "Cabimentado",
          backgroundColor: "#2850a7",
        },
        {
          label: "Faturado",
          backgroundColor: "#2ecc71",
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


  $(".inputContainer input, .inputContainer textarea").click(function () {
    $(this).parent().addClass("inputFocus")
  });

  $(".inputContainer input, .inputContainer textarea").focusout(function () {
    if ($(this).val() == "") {
      $(this).parent().removeClass("inputFocus")
    }
  });

  $(".cancelNewProj, .blackBackground").click(function () {
    $(".blackBackground, .addListItemContainer").addClass("hideComponent")
  });

  $(".newProjectContainer").click(function () {
    $(".blackBackground, .addListItemContainer").removeClass("hideComponent")
  });

  $("#anoProjeto").val((new Date()).getFullYear()).parent().addClass("inputFocus")

  $(".submitNewProj").click(function () {
    let sendNewProjData = {};

    $(".formContainer input").each(function () {
      if ($(this).val() != "") {
        sendNewProjData[$(this).attr("id")] = $(this).val()
      }else{
        sendNewProjData[$(this).attr("id")] = "ND"
      }
    });

    if ($("#nomeProjeto").val() != "" && $("#anoProjeto").val() != "") {
      fetch('/addNewProject', {
        method: 'post',
        body: JSON.stringify(sendNewProjData),
        headers: {
          'content-type': 'application/json'
        },
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        location.reload()
      });
    } else {
      showErrorMessage("Por favor preencha todos os campos obrigatórios (*)")
    }
  });




  // FUNCTIONS
  let getStats = (project, year) => {
    fetch('/projectStats', {
      method: 'post',
      body: JSON.stringify({
        project: project,
        year: year
      }),
      headers: {
        'content-type': 'application/json'
      },
    }).then(function (response) {
      return response.json();
    }).then(function (res) {
      myBarChart.data.datasets[0].data = res.cabimentoAnual
      myBarChart.data.datasets[1].data = res.faturadoAnual
      myBarChart.update()
    });
  }
  let showErrorMessage = msg => {
    $(".resultIcon").removeClass("fa-check").addClass("fa-times");
    $(".resultMessageContent .message").html(msg)
    $(".resultMessageContainer").addClass("error").removeClass("hideSlide");
    setTimeout(() => {
      $(".resultMessageContainer").addClass("hideSlide")
    }, 3000)
  }
});