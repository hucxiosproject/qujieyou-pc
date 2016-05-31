// var loadTime = 800;//loading的最短时间，单位为s
var loadTime = 1.6;//loading的最短时间，单位为s
var startTime = (new Date()).valueOf();

if (window.addEventListener) {
  addEventListener('load',function() {
    setTimeout(function() {
      loadComplete();
    },1);
  });
}

if (window.attachEvent) {
  attachEvent('load',function() {
    setTimeout(function() {
      loadComplete();
    },1);
  });
}

function loadComplete() {
  var deltaTime = (new Date()).valueOf() - startTime;
  if (deltaTime < loadTime*1000) {
    setTimeout(function() {
      fadeToLogin();
    },loadTime*1000 - deltaTime);
  } else {
    fadeToLogin();
  }
}

function fadeToLogin() {
  document.getElementById("loader").style.display = "none";
  // document.getElementById("editpage").style.display = "block";
  document.getElementById("login-confirm-page").style.display = "block";
}
