if (window.innerWidth >= 991) {
  $("#sharebtn").on("mouseenter", () => {
    $(".share").addClass("open");
    $(".share .body-caps").text("CLOSE");
  });
  $("#sharebtn").on("click", closeShare);
} else {
  $("#sharebtn").on("click", () => {
    $(".share").addClass("open");
    $(".share .body-caps").text("CLOSE");
  });
  $("#sharebtn").on("click", closeShare);
}

function closeShare() {
  if ($(".share").hasClass("open")) {
    $(".share").removeClass("open");
    $(".share .body-caps").text("SHARE");
  }
}
