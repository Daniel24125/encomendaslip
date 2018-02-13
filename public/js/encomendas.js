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
      allData.map((item, index)=>retrieveData(allKeys[index], item)) 
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
        $(".pedidoContainer, .comentariosContainer").css("z-index","-1")
        $(".itemMoreInfo").children().removeClass("fa-caret-up").addClass("fa-caret-down")
        $(".moreInfoContainer").css({
          "height": "0"
        });
      })
    }
  });

  $(".loadContent").click(()=>{
    $(".loadContent, .loadMoreContainer .spinner").toggleClass("hideComponent")
    fetch(`/getData?num=${allData.length}`)
    .then(response => response.json())
    .then(res => {
      $(".loadContent, .loadMoreContainer .spinner").toggleClass("hideComponent")
      console.log(res)
      // allData = res.data.reverse();  
      // allKeys = res.keys.reverse();
      // allData.map((item, index)=>retrieveData(allKeys[index], item)) 
    });
  })

  let retrieveData = (key, item) => {
    let estado, 
     dataFatura = item.dataFatura,
     faturaSecretaria= "",
     notaEncomenda =` <th class="cell">${item.notaEncomenda}</th>`,
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

    if(item.dataFatura.length==0 || item.dataFatura=="//" ){
      dataFatura = "ND"
    }
    
    if(item.faturaSecretaria=="Sim"){
      faturaSecretaria = "faturaSecretaria"
    }

    if(item.pedidoCredito=="Sim"){
      pedidoCredito = "pedidoCredito"
    }

    if(item.notaEncomenda.length > 30){
      notaEncomenda =`<th title="${item.notaEncomenda}" class="cell">${item.notaEncomenda.slice(0,30) + "..."}</th>`
      
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