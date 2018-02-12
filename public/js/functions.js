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

  $("iframe").attr("src", "pages/" + $(".active").attr("id") + ".html")

  function showNav() {
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
    $(".blackBackground").removeClass("hideComponent")
  }

  function hideNav() {
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
  }
})