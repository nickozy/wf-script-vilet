//
//

const shMain = $(".share");
const shText = $(".share .body-caps");
const shBtn = $("#sharebtn");

//
//

if (window.innerWidth > 991) {
  shBtn.on("mouseenter", () => {
    shMain.addClass("open");
    shText.text("CLOSE");
  });
  shBtn.on("click", closeShare);
} else {
  shBtn.on("click", toggleShare);
}

function closeShare() {
  if ($(".share").hasClass("open")) {
    shMain.removeClass("open");
    shText.text("SHARE");
  }
}

function toggleShare() {
  shMain.toggleClass("open");
  if ($(".share").hasClass("open")) {
    shText.text("CLOSE");
  } else {
    shText.text("SHARE");
  }
}
