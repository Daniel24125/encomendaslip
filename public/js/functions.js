$(document).ready(function () {
  let menuClicked = false
  $(".menu-icon-container").click(() => {
    if (menuClicked) {
      menuClicked = false
      hideNav()
    } else {
      menuClicked = true
      showNav()
    }

  });

  $("#logout").click(function(){
    fetch('/logout', {
      method: 'post'
    }).then(()=>  window.location.href = "log/login.html");
  });

  $(".navListContainer .navItemContainer").click(function () {
    $(".active").removeClass("active");
    menuClicked = !menuClicked;
    hideNav();
    $("iframe").attr("src", "pages/" + $(this).attr("id") + ".html");
    $(this).addClass("active")
  });

  // LISTA DE FORNECEDORES

  fetch('/getFornecedores')
    .then(response => response.json())
    .then(res => {
      let showNames = Object.keys(res)
      showNames.map(name => {
        let current = res[name]
        $(".listaFornecedores").append(`
      <div class="fornecedor" data-fornecedor="${current.nome}" data-email="${current.email}" data-numero="${current.numero}" data-comercial="${current.comercial}">
        <span class="fornecedorDisplayName">${name}</span>  
        <div class="deleteFornecedor">
          <span class=" fa fa-trash"></span>
        </div>
      </div>
      `)
      })

    });

  $("#fornecedores").click(function () {
    let drawerWidth = parseInt($(".drawerHeaderContainer").css("width"));
    $(".listaFornecedoresContainer").css("left", drawerWidth + "px");
    closeCreditos();
    $(".blackBackground").removeClass("hideComponent");

  });

 
  $(".closeFornecedores").click(function () {
    closeFornecedores();
  });



  $("body").on("click", ".fornecedor", function (e) {
    let fornecedorName = $(this).data("fornecedor");
    let fornecedorComercial = $(this).data("comercial");
    let fornecedorEmail = $(this).data("email");
    let fornecedorNumero = $(this).data("numero");
    let topPosition = $(this).position().top;
    showFornecedoresCard(topPosition, fornecedorName, fornecedorComercial, fornecedorEmail, fornecedorNumero)
  });

  let fornecedorName, element;
  $("body").on("click", ".deleteFornecedor", function (e) {  
    fornecedorName = $(this).prev().html();
    element = $(this).parent();
    $(".confirmDeleteContainer").removeClass("hideComponent")
    e.stopPropagation()
  })

  $(".closeCardContainer").click(function () {
    closeFornecedoresInfo();
  })

  $(".confirmDelete").click(function(){
    fetch('/removeFornecedor', {
      method: 'delete',
      body: JSON.stringify({fornecedorName}),
      headers: {'content-type': 'application/json'},
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      showSuccessMessage(data.msg);
      $(".confirmDeleteContainer").addClass("hideComponent")
    });
    element.remove()
  });

  $(".cancelDelete").click(function(){
    $(".confirmDeleteContainer, .confirmDeleteContainerCredito").addClass("hideComponent")
  });

  let newFornecedorClicked = false;
  $(".addFornecedores").click(function () {
    if (newFornecedorClicked == false) {
      newFornecedorClicked = true
      $(".listaFornecedores").prepend(`
      <div class="newFornecedorForm">
      <div class="inputFornecedorContainer">
        <input type="text" name="newFornecedor" id="newFornecedorName">
      </div>
      <div class="btnContainer">
        <span class="btn saveNewFornecedor fa fa-save"></span>
        <span class="btn cancelNewFornecedor fa fa-times-circle"></span>
      </div>
    </div>
      `);
      showFornecedoresCard($(".newFornecedorForm").position().top,
        "",
        '<input class="newFornecedorInput" type="text" name="fornecedorComercial" id="fornecedorComercial" placeholder="Comercial">',
        '<input class="newFornecedorInput" type="text" name="fornecedorEmail" id="fornecedorEmail" placeholder="Email">',
        '<input class="newFornecedorInput" type="text" name="fornecedorNumero" id="fornecedorNumero" placeholder="Numero">'
      );

    }
  });

  $("body").on("click", ".saveNewFornecedor", function () {
    let saveFornecedorName = $(this).parent().prev().children().val();
    let saveFornecedorComercial = $("#fornecedorComercial").val();
    let saveFornecedorEmail = $("#fornecedorEmail").val();
    let saveFornecedorNumero = $("#fornecedorNumero").val();

    if (saveFornecedorComercial == "") {
      saveFornecedorComercial = "ND"
    }
    if (saveFornecedorEmail == "") {
      saveFornecedorEmail = "ND"
    }
    if (saveFornecedorNumero == "") {
      saveFornecedorNumero = "ND"
    }

    let sendNewFornecedorData = {};
    sendNewFornecedorData[saveFornecedorName] = {
      "nome": saveFornecedorName,
      "comercial": saveFornecedorComercial,
      "email": saveFornecedorEmail,
      "numero": saveFornecedorNumero
    }

    fetch('/addNewFornecedor', {
      method: 'post',
      body: JSON.stringify(sendNewFornecedorData),
      headers: {
        'content-type': 'application/json'
      },
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      showSuccessMessage(data.msg);
      $(".listaFornecedores").append(`
      <div class="fornecedor" data-fornecedor="${data.data.nome}" data-email="${data.data.email}" data-numero="${data.data.numero}" data-comercial="${data.data.comercial}">
        <span class="fornecedorDisplayName">${data.data.nome}</span>  
        <div class="deleteFornecedor">
          <span class=" fa fa-trash"></span>
        </div>
      </div>
      `)

      $(".newFornecedorForm").remove()
      closeFornecedoresInfo();
      newFornecedorClicked = false
    });

  });

  $("body").on("click", ".cancelNewFornecedor", function () {
    $(".newFornecedorForm").remove()
    closeFornecedoresInfo();
    newFornecedorClicked = false
  });

  // LISTA DE CRÉDITOS

  fetch('/getCred')
  .then(response => response.json())
  .then(res => {
    Object.keys(res).map(name => {
      let current = res[name]
      $(".listaCreditos").append(`
    <div class="credito creditos">
      <span class="creditosDisplayName">${name}</span>:
      <span class="creditosDisplayValue"> ${current}€</span>   
      <div class="optionsCredito">
        <span class="editCredito fa fa-edit"></span>
        <span class="deleteCredito fa fa-trash"></span>
      </div>
    </div>
    `)
    });
  });

  $("#creditos").click(function () {
    let drawerWidth = parseInt($(".drawerHeaderContainer").css("width"));
    $(".listaCreditosContainer").css("left", drawerWidth + "px");
    closeFornecedores();
    $(".blackBackground").removeClass("hideComponent");
  });

  $(".closeCreditos").click(function () {
    closeCreditos();
  });

  let addCredClicked = false;
  
  $(".addCreditos").click(function(){
    if(addCredClicked==false){
      $(".listaCreditos").append(`
      <div class="newCredForm creditos">
        <input name="newCredName" id="newCredName" placeholder="Nome"/>
        <input name="newCredValue" id="newCredValue" placeholder="Valor"/>  
        <div class="optionsCredito">
          <span class="saveCredito fa fa-save"></span>
          <span class="cancelCredito fa fa-times"></span>
        </div>
      </div>
      `)
      addCredClicked = true
    }
  });

  $("body").on("click", ".cancelCredito", function(){
    $(".newCredForm").remove();
    addCredClicked = false
  });

  $("body").on("click", ".saveCredito", function(){
    if($("#newCredName").val()!="" && $("#newCredValue").val()){
     if(isNaN($("#newCredValue").val())==false){
        fetch('/saveCredito', {
          method: 'post',
          body: JSON.stringify({
            name: $("#newCredName").val(),
            value: parseFloat($("#newCredValue").val())
          }),
          headers: {
            'content-type': 'application/json'
          },
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          showSuccessMessage(data.msg);
          $(".newCredForm").remove();
          $(".listaCreditos").append(`
          <div class="creditos">
          <span class="creditosDisplayName">${data.name}</span>:
          <span class="creditosDisplayValue"> ${data.value}€</span>   
          <div class="optionsCredito">
            <span class="editCredito fa fa-edit"></span>
            <span class="deleteCredito fa fa-trash"></span>
          </div>
        </div>
          `)
  
          newFornecedorClicked = false
        });
      }else{
        showErrorMessage("O valor do crédito necessita de ser um número")
      }
    }else{
      showErrorMessage("Por favor preencha o nome e o valor do crédito")
    }
    addCredClicked = false
  });

  let clickedCred, credElement;
  $("body").on("click", ".deleteCredito", function(){
    credElement = $(this).parents().eq(1)
    clickedCred = $(this).parents().eq(1).children(".creditosDisplayName").html();
    $(".confirmDeleteContainerCredito").removeClass("hideComponent")
  });

  $(".confirmDeleteCredito").click(function(){
    fetch('/removeCred', {
      method: 'delete',
      body: JSON.stringify({
        cred: clickedCred
      }),
      headers: {
        'content-type': 'application/json'
      },
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      $(".confirmDelete").addClass("confirmDelete").removeClass("confirmDeleteCredito");
      showSuccessMessage(data.msg);
      $(".confirmDeleteContainerCredito").addClass("hideComponent");
      credElement.remove()
    });
  });

  let selectedName,selectedValue
  $("body").on("click", ".editCredito",function(){
    selectedName= $(this).parents().eq(1).children(".creditosDisplayName").html();
    selectedValue   =$(this).parents().eq(1).children(".creditosDisplayValue").html().split("€")[0]
        $(this).parents().eq(1).html("").append(`
    <input name="newCredName" id="newCredName" placeholder="Nome" value="${selectedName}"/>
        <input name="newCredValue" id="newCredValue" placeholder="Valor" value="${selectedValue}"/>  
        <div class="optionsCredito">
          <span class="saveEditCredito fa fa-save"></span>
          <span class="cancelEditCredito fa fa-times"></span>
        </div>
        `)
  });

  $("body").on("click", ".cancelEditCredito", function(){
    $(this).parents().eq(1).html("").append(`
    <span class="creditosDisplayName">${selectedName}</span>:
    <span class="creditosDisplayValue"> ${selectedValue}€</span>   
    <div class="optionsCredito">
      <span class="editCredito fa fa-edit"></span>
      <span class="deleteCredito fa fa-trash"></span>
    </div>
    `)
  });

  $("body").on("click", ".saveEditCredito", function(){
    if($("#newCredName").val()!="" && $("#newCredValue").val()){
     if(isNaN($("#newCredValue").val())==false){
      selectedName = $("#newCredName").val();
      selectedValue = parseFloat($("#newCredValue").val());
      $(this).parents().eq(1).html("").append(`
      <span class="creditosDisplayName">${selectedName}</span>:
      <span class="creditosDisplayValue"> ${selectedValue}€</span>   
      <div class="optionsCredito">
        <span class="editCredito fa fa-edit"></span>
        <span class="deleteCredito fa fa-trash"></span>
      </div>
      `)
        fetch('/saveCredito', {
          method: 'post',
          body: JSON.stringify({
            name: selectedName,
            value: selectedValue
          }),
          headers: {
            'content-type': 'application/json'
          },
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          showSuccessMessage(data.msg);
        });
      }else{
        showErrorMessage("O valor do crédito necessita de ser um número")
      }
    }else{
      showErrorMessage("Por favor preencha o nome e o valor do crédito")
    }
  });

  $("iframe").attr("src", "pages/" + $(".active").attr("id") + ".html")

  let showNav = () => {

    $(".line-top").css({
      "top": "50%",
      "transform": "translate(-50%, -50%) rotate(-45deg)"
    });
    $(".line-center").css({
      "opacity": 0
    });
    $(".line-bottom").css({
      "top": "50%",
      "transform": "translate(-50%, -50%) rotate(45deg)"
    });
    $(".drawerContainer").css("width", "230px")
    setTimeout(() => {
      $(".navDesc").removeClass("hideComponent")
    }, 300)

    $(".blackBackground").removeClass("hideComponent");
  }

  let hideNav = () => {
    $(".line-top").css({
      "top": "39%",
      "transform": "translateX(-50%) rotate(0deg)"
    });
    $(".line-center").css({
      "opacity": 1
    });
    $(".line-bottom").css({
      "top": "61%",
      "transform": "translateX(-50%) rotate(0deg)"
    });
    $(".navDesc").addClass("hideComponent")
    $(".drawerContainer").css("width", "50px")
    $(".blackBackground").addClass("hideComponent")
    closeFornecedores();

  }

  let closeFornecedores = () => {
    let distance = $(".listaFornecedoresContainer").css("width");
    $(".listaFornecedoresContainer").css("left", `-${distance}`);
    $(".blackBackground").addClass("hideComponent")
    closeFornecedoresInfo();
  }

  
  let closeCreditos = () => {
    let distance = $(".listaCreditosContainer").css("width");
    $(".listaCreditosContainer").css("left", `-${distance}`);
    $(".blackBackground").addClass("hideComponent")
  }

  let closeFornecedoresInfo = () => {
    let distance = $(".fornecedorCardContainer").css("width");
    $(".fornecedorCardContainer").animate({
      "left": `-${distance}`
    }, 300);
  }


  let showFornecedoresCard = (top, name, comercial, email, numero) => {
    let leftPosition = parseInt($(".listaFornecedoresContainer").css("width"));
    $(".fornecedorCardContainer").animate({
      "left": `-${$(".fornecedorCardContainer").css("width")}`
    }, 300, function () {
      if ((window.innerHeight - top) < parseInt($(".fornecedorCardContainer").css("height"))) {
        let newTop = window.innerHeight - parseInt($(".fornecedorCardContainer").css("height"))
        $(".fornecedorCardContainer").css("top", newTop + "px")
      } else {
        $(".fornecedorCardContainer").css("top", top + "px")
      }
      $(".fornecedorNome").html(name)
      $(".fornecedorComercial").html(comercial)
      $(".fornecedorEmail").html(email)
      $(".fornecedorNumero").html(numero)
      $(".fornecedorCardContainer").animate({
        "left": leftPosition + "px"
      }, 300);
    })
  }


  let showSuccessMessage = msg => {
    $(".resultIcon").removeClass("fa-times").addClass("fa-check");
    $(".resultMessageContent .message").html(msg)
    $(".resultMessageContainer").removeClass("error").addClass("success").removeClass("hideSlide");
    setTimeout(() => {
      $(".resultMessageContainer").addClass("hideSlide")
    }, 3000)
  }

  let showErrorMessage = msg => {
    $(".resultIcon").removeClass("fa-check").addClass("fa-times");
    $(".resultMessageContent .message").html(msg)
    $(".resultMessageContainer").removeClass("success").addClass("error").removeClass("hideSlide");
    setTimeout(() => {
      $(".resultMessageContainer").addClass("hideSlide")
    }, 3000)
  }
})
