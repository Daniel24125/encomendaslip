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


  $(".navListContainer .navItemContainer").click(function () {
    $(".active").removeClass("active");
    menuClicked = !menuClicked;
    hideNav();
    $("iframe").attr("src", "pages/" + $(this).attr("id") + ".html");
    $(this).addClass("active")
  });


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
    $(".confirmDeleteContainer").addClass("hideComponent")
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
    $(".resultMessageContainer").addClass("success").removeClass("hideSlide");
    setTimeout(() => {
      $(".resultMessageContainer").addClass("hideSlide")
    }, 3000)
  }


})
