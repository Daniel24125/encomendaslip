$(document).ready(function(){
  let menuClicked = 0
  $(".menu-icon-container").click(()=>{
    if(menuClicked){
      menuClicked = 0
      hideNav()
    }else{
      menuClicked = 1
      showNav()
    }
    
  });
  
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
  }
})