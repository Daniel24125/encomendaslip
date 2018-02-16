$(document).ready(function () {
  let moreInfoClicked = false;
  let allData, allKeys;
  $("#searchForm").submit((e) => {
    e.preventDefault();
  });

  fetch('/getData?num=0')
    .then(response => response.json())
    .then(res => {
      $(".loader").addClass("hideComponent")
      allData = res.data.reverse();
      allKeys = res.keys.reverse();
      allData.map((item, index) => retrieveData(allKeys[index], item))
    });

    fetch('/getProjectsNames')
      .then(response => response.json())
      .then(res => {
        for(let i = 0; i<res.length; i++){
          $("#fundo").append(`
          <option value="${res[i]}">${res[i]}</option>
          `)
        }
       
      });

  $("body").on("click", ".itemMoreInfo", function () {
    moreInfoClicked = !moreInfoClicked;
    let id = $(this).parent().attr("id");
    let dataIndex = allKeys.indexOf(id);
    $(".pedidoText").html(allData[dataIndex].pedido);
    $(".comentariosText").html(allData[dataIndex].notas);
    $(this).children().toggleClass("fa-caret-down fa-caret-up")
    if (moreInfoClicked) {
      $(".moreInfoContainer").css("top", 30 + $(this).position().top + parseFloat($(this).parent().css("height")))
        .animate({
          "height": "120px"
        }, 300, function () {
          $(".pedidoContainer, .comentariosContainer").css({
            "opacity": 1,
            "visibility": "visible",
            "z-index": 1
          })
        })
    } else {
      $(".pedidoContainer, .comentariosContainer").animate({
        "opacity": 0,
        "visibility": "hidden"
      }, 300, function () {
        $(".pedidoContainer, .comentariosContainer").css("z-index", "-1")
        $(".itemMoreInfo").children().removeClass("fa-caret-up").addClass("fa-caret-down")
        $(".moreInfoContainer").css({
          "height": "0"
        });
      })
    }
  });

  $(".loadContent").click(() => {
    $(".loadContent, .loadMoreContainer .spinner").toggleClass("hideComponent")
    fetch(`/getData?num=${allData.length}`)
      .then(response => response.json())
      .then(res => {
        let newData = res.data.reverse();
        let newKeys = res.keys.reverse();

        newData.map((item, index) => {
          retrieveData(newKeys[index], item);
          allData.push(item);
          allKeys.push(newKeys[index]);
        })
        $(".loadContent, .loadMoreContainer .spinner").toggleClass("hideComponent")
      });
  })

  $(".inputContainer input, .inputContainer textarea").click(function () {
    $(this).parent().addClass("inputFocus")
  });

  $(".inputContainer input, .inputContainer textarea").focusout(function () {
    if ($(this).val() == "") {
      $(this).parent().removeClass("inputFocus")
    }
  });

  $(".estadoContainer .newItemIcon").click(function () {
    $(".estadoContainer .newItemIcon").children().addClass("notClicked")
    $(this).children().toggleClass("notClicked")
  });

  $(".configContainer .newItemIcon").click(function () {
    $(this).children().toggleClass("notClicked")
  });

  //REGISTO DE NOVA ENCOMENDA
  $(".saveNewItem").click(function () {
    let estado, newCredito = "Não",
      newSecretaria = "Não";
    if ($(".pedidoCredito").hasClass("notClicked") == false) {
      newCredito = "Sim"
    }

    if ($(".faturaSecretaria").hasClass("notClicked") == false) {
      newSecretaria = "Sim"
    }

    $(".estadoContainer .newItemIcon").each(function () {
      if ($(this).children().hasClass("notClicked") == false) {
        estado = $(this).children().data("estado")
      }
    });

    let cabimentado = formatNumber($("#cabimentado").val());
    let faturado = formatNumber($("#faturado").val());
    let saveValues = {
      "data": $("#data").val(),
      "pedidoAno": parseInt($("#data").val().substring(6, 10)),
      "pedidoMes": parseInt($("#data").val().substring(3, 5)),
      "pedido": $("#pedido").val(),
      "remetente": $("#remetente").val(),
      "rubrica": $("#rubrica").val(),
      "fornecedor": $("#fornecedor").val(),
      "notaEncomenda": $("#notaEncomenda").val(),
      "fundo": $("#fundo").val(),
      "cabimentado": cabimentado,
      "dif": cabimentado - faturado,
      "faturado": faturado,
      "estado": estado,
      "notas": $("#notas").val(),
      "pedidoCredito": newCredito,
      "dataFatura": $("#dataFatura").val(),
      "faturaAno": parseInt($("#dataFatura").val().substring(6, 10)),
      "faturaMes": parseInt($("#dataFatura").val().substring(3, 5)),
      "faturaSecretaria": newSecretaria
    };
    fetch('/addNew', {
      method: 'post',
      body: JSON.stringify(saveValues),
      headers: {
        'content-type': 'application/json'
      },
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data)
      });

  });


  $(".cancelNewItem").click(function () {
    $(".addListItemContainer, .blackBackground").addClass("hideComponent");
  });

  $(".newListItemBtn").click(function () {
    $(".addListItemContainer, .blackBackground").removeClass("hideComponent");
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    today = dd + '/' + mm + '/' + yyyy;
    $("#data").val(today).parent().addClass("inputFocus")
  });

  let formatNumber = (num) => {
    let formatedNum = num
    if (num.indexOf(",") != -1) {
      formatedNum = num.replace(",", ".")
    }
    return parseFloat(formatedNum)
  }


  let retrieveData = (key, item) => {
    let estado,
      dataFatura = item.dataFatura,
      faturaSecretaria = "",
      notaEncomenda = ` <th class="cell">${item.notaEncomenda}</th>`,
      pedidoCredito = "";

    switch (item.estado) {
      case "Feito":
        estado = '<span  title="Feito" class="feito fa fa-check"></span>'
        break;
      case "Cabimento_pedido":
        estado = '<span  title="Cabimento Pedido" class="cabimentado fa fa-cart-plus"></span>'
        break;
      case "Anulado":
        estado = '<span  title="Anulado" class="anulado fa fa-ban"></span>'
        break;
      case "Pendente":
        estado = '<span  title="Pendente" class="pendente fa fa-pause"></span>'
        break;
      case "Encomendado":
        estado = '<span  title="Encomendado" class="encomendado fa fa-truck"></span>'
        break;
    }

    if (item.dataFatura.length == 0 || item.dataFatura == "//") {
      dataFatura = "ND"
    }

    if (item.faturaSecretaria == "Sim") {
      faturaSecretaria = "faturaSecretaria"
    }

    if (item.pedidoCredito == "Sim") {
      pedidoCredito = "pedidoCredito"
    }

    if (item.notaEncomenda.length > 30) {
      notaEncomenda = `<th title="${item.notaEncomenda}" class="cell">${item.notaEncomenda.slice(0,30) + "..."}</th>`

    }

    $("#tabelaEncomendas").append(`
    <tr id="${key}">
      <th class="stateIcon estado">
        ${estado}
      </th>
      <th class="cell">${item.data}</th>
      <th class="cell">${item.remetente}</th>
      <th class="cell">${item.rubrica}</th>
      <th class="cell">${item.fornecedor}</th>
      ${notaEncomenda}
      <th class="cell">${item.fundo}</th>
      <th class="cell">${item.cabimentado}</th>
      <th class="cell">${item.faturado}</th>
      <th class="cell">${dataFatura}</th>
      <th class="stateIcon credito">
        <span title="Acréscimo ao Crédito?" class="fa fa-credit-card ${pedidoCredito}"></span>
      </th>
      <th class="stateIcon faturaSecretaria">
        <span title="Fatura Entregue na Secretaria?"  class="fa fa-file ${faturaSecretaria}"></span>
      </th>
      <th title="Editar" class="stateIcon editItem ">
        <span class="fa fa-edit"></span>
      </th>
      <th title="Eliminar" class="stateIcon deleteItem ">
        <span class="fa fa-times-circle"></span>
      </th>
      <th class="stateIcon info itemMoreInfo">
        <span title="Informação Complementar" class="fa fa-caret-down"></span>
      </th>
    </tr>   
    `);

  }

});