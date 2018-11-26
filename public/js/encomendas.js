$(document).ready(function () {
  let moreInfoClicked = false;
  let allData, allKeys, fornecedoresNames;

  $("#searchForm").submit((e) => {
    searchTerm();
    e.preventDefault();
  });

  $("body").on("click", ".cancelSearch", function(){
    $(".loader").removeClass("hideComponent")
    $("#tabelaEncomendas").html("");
    $(".loadMoreContainer").removeClass("hideComponent")
    $(".submitButton").html(`
      <div class="fa fa-search"></div>
    `);
    $("#searchTerm").val("")
    fetch('/getData?num=0', {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(res => {
      $(".loader").addClass("hideComponent")
      allData = res.data.reverse();
      allKeys = res.keys.reverse();
      allData.map((item, index) => retrieveData(allKeys[index], item))
    });

  });

  fetch('/getData?num=0', {
    credentials: 'include'
  })
    .then(response => response.json())
    .then(res => {
      $(".loader").addClass("hideComponent")
      allData = res.data.reverse();
      allKeys = res.keys.reverse();
      allData.map((item, index) => retrieveData(allKeys[index], item))
    });

    fetch('/getProjectsNames', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(res => {
        for(let i = 0; i<res.length; i++){
          $("#fundo").append(`
          <option value="${res[i]}">${res[i]}</option>
          `)
        }
      });

      fetch('/getFornecedores', {
        credentials: 'include'
      })
      .then(response => response.json())
      .then(res => {
        fornecedoresNames = Object.keys(res)
        fornecedoresNames.map(item=>{
          $(".fornecedoresList").append(`
          <div class="fornecedor">${item}</div>
          `)
        });
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
    fetch(`/getData?num=${allData.length}`, {
      credentials: 'include'
    })
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
    //$(this).children().toggleClass("notClicked")
    console.log($(".pedidoCredito").hasClass("notClicked"))
  });

  
  //REGISTO DE NOVA ENCOMENDA
  $(".showFornecedoresListBtn").click((e)=>{
    $(".fornecedoresList").removeClass("hideComponent");
    e.stopPropagation()
  });

  $(".addListItemContainer").click(function(){
    $(".fornecedoresList").addClass("hideComponent");
  })

  $("body").on("click", ".fornecedor", function(){
    let selectedFornecedor = $(this).html()
    $("#fornecedor").val(selectedFornecedor).parent().addClass("inputFocus")
    $(".fornecedoresList").addClass("hideComponent");
  });

  let editItem;
  let orderId; 
  $(".saveNewItem").click(function () {
    let estado, newCredito = "Não",
      newSecretaria = "Não";
    console.log($(".newItemIcon .pedidoCredito").hasClass("notClicked"))
    if ($(".pedidoCredito").hasClass("notClicked") == false) {
      newCredito = "Sim"
    }

    if ($(".newFaturaSecretaria").hasClass("notClicked") == false) {
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

    if(editItem==false){
      fetch('/addNew', {
        method: 'post',
        body: JSON.stringify(saveValues),
        headers: {
          'content-type': 'application/json'
        },
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          allData.unshift(data.newData.data);
          allKeys.unshift(data.newData.key)
          retrieveData(data.newData.key, data.newData.data, true);
          $(".addListItemContainer, .blackBackground").addClass("hideComponent");
          showSuccessMessage(data.msg)
        });
    }else{
      fetch('/editOrder', {
        method: 'post',
        body: JSON.stringify({
          id: orderId,
          editData: saveValues
        }),
        headers: {
          'content-type': 'application/json'
        },
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          $(".addListItemContainer, .blackBackground").addClass("hideComponent");
          showSuccessMessage(data.msg);
          let index = allKeys.indexOf(orderId);
          updateItem(orderId, data.newData, index)
        });
    }
   
  });

    $(".cancelNewItem").click(function () {
    $(".addListItemContainer, .blackBackground").addClass("hideComponent");
  });

  $(".newListItemBtn").click(function () {
    editItem = false;
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

  
  $("body").on("click", ".deleteItem", function(){
    orderId = $(this).parent().attr("id");
    $(".confirmDeleteContainer, .blackBackground").removeClass("hideComponent");
  });

  $(".confirmDelete").click(function(){
    fetch('/removeOrder', {
      method: 'delete',
      body: JSON.stringify({id:orderId}),
      headers: {
        'content-type': 'application/json'
      },
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        $(`#${orderId}`).remove()
        showSuccessMessage(data.msg);
        $(".confirmDeleteContainer, .blackBackground").addClass("hideComponent");
      });
  });

  $(".cancelDelete").click(()=>{
    $(".confirmDeleteContainer, .blackBackground").addClass("hideComponent");
  });

  $("body").on("click", ".editItem", function(){
    editItem = true;
    orderId = $(this).parent().attr("id");
    let index = allKeys.indexOf(orderId);
    $(".pedidoCredito").addClass("notClicked");
    $(".newFaturaSecretaria").addClass("notClicked");

    $("#data").val(allData[index].data);
    $("#remetente").val(allData[index].remetente);
    $("#pedido").val(allData[index].pedido);
    $("#fornecedor").val(allData[index].fornecedor);
    $("#notaEncomenda").val(allData[index].notaEncomenda);
    $("#cabimentado").val(allData[index].cabimentado);
    $("#faturado").val(allData[index].faturado);
    $("#dataFatura").val(allData[index].dataFatura);
    $("#notas").val(allData[index].notas);
    $("#rubrica").val(allData[index].rubrica);
    $("#fundo").val(allData[index].fundo);

    $(".newItemIcon").children().addClass("notClicked");
    $(`#${allData[index].estado}`).removeClass("notClicked")
    if(allData[index].pedidoCredito=="Sim"){
      $(".pedidoCredito").removeClass("notClicked");
    }
    if(allData[index].faturaSecretaria=="Sim"){
      $(".newFaturaSecretaria").removeClass("notClicked");
    }
    $(".inputContainer").addClass("inputFocus");
    $(".addListItemContainer, .blackBackground").removeClass("hideComponent");
  });



  // FUNCTIONS-------------------------------------

  let updateItem = (id, item, index)=>{
    allData[index] = item;
    let estado,
    dataFatura = item.dataFatura,
    notaEncomenda = item.notaEncomenda;
  
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
    $(`#${orderId} .faturaSecretaria `).children().addClass("faturaSecretaria")
  }else{
    $(`#${orderId} .faturaSecretaria `).children().removeClass("faturaSecretaria")
  }

  if (item.pedidoCredito == "Sim") {
    $(`#${orderId} .credito `).children().addClass("pedidoCredito")
  }else{
    $(`#${orderId} .credito `).children().removeClass("pedidoCredito")
  }

  if (item.notaEncomenda.length > 30) {
    notaEncomenda = item.notaEncomenda.slice(0,30) + "..."
  }

  let updatedItem = [item.data, item.remetente, item.rubrica, item.fornecedor, item.notaEncomenda, item.fundo, item.cabimentado, item.faturado, item.dataFatura]

  $(`#${orderId} .estado`).html(estado)
  $(`#${orderId}`).children(".cell").each(function(i){
    $(this).html(updatedItem[i])
  });
  
  }

  let formatNumber = (num) => {
    let formatedNum = num
    if (num.indexOf(",") != -1) {
      formatedNum = num.replace(",", ".")
    }else if(formatedNum == ""){
      formatedNum = 0
    }
    return parseFloat(formatedNum)
  }

  let showSuccessMessage = msg => {
    $(".resultIcon").removeClass("fa-times").addClass("fa-check");
    $(".resultMessageContent .message").html(msg)
    $(".resultMessageContainer").addClass("success").removeClass("hideSlide");
    setTimeout(() => {
      $(".resultMessageContainer").addClass("hideSlide")
    }, 3000)
  }

  let showErrorMessage = msg => {
    $(".resultIcon").removeClass("fa-check").addClass("fa-times");
    $(".resultMessageContent .message").html(msg)
    $(".resultMessageContainer").addClass("error").removeClass("hideSlide");
    setTimeout(() => {
      $(".resultMessageContainer").addClass("hideSlide")
    }, 3000)
  }

  let retrieveData = (key, item, addNew) => {
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


    if(addNew){
      $("#tabelaEncomendas").prepend(`
    <tr id="${key}">
      <th class="stateIcon estado">
        ${estado}
      </th>
      <th>${item.data}</th>
      <th>${item.remetente}</th>
      <th>${item.rubrica}</th>
      <th>${item.fornecedor}</th>
      ${notaEncomenda}
      <th>${item.fundo}</th>
      <th>${item.cabimentado}</th>
      <th>${item.faturado}</th>
      <th>${dataFatura}</th>
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
    }else{
      $("#tabelaEncomendas").append(`
      <tr id="${key}">
        <th class="stateIcon estado">
          ${estado}
        </th>
        <th>${item.data}</th>
        <th>${item.remetente}</th>
        <th>${item.rubrica}</th>
        <th>${item.fornecedor}</th>
        ${notaEncomenda}
        <th>${item.fundo}</th>
        <th>${item.cabimentado}</th>
        <th>${item.faturado}</th>
        <th>${dataFatura}</th>
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
  }


  let searchTerm = ()=>{
    if($("#searchTerm").val() == ""){
      showErrorMessage("Por favor insira um termo para pesquisar")
    }else{
      $(".loader").removeClass("hideComponent")
      fetch('/searchOrder', {
        method: 'post',
        body: JSON.stringify({
          field: $("#searchParameter").val(),
          search:$("#searchTerm").val()
        }),
        headers: {
          'content-type': 'application/json'
        },
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          $(".loader").addClass("hideComponent")
          if(data.error){
            showErrorMessage(data.msg)
          }else{
            $("#tabelaEncomendas").html("");
            $(".loadMoreContainer").addClass("hideComponent")
            $(".submitButton").html(`
              <div class="cancelSearch fa fa-times"></div>
            `);
            allData = data.searchData.reverse();
            allKeys = data.keys.reverse();
            allData.map((item, index) => retrieveData(allKeys[index], item))
          }
        });
    }
  }
});
