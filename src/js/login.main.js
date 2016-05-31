var ws;
if (window.addEventListener) {
  addEventListener('load',function() {
    setTimeout(function() {
      loadHandler();
    },1);
  });
}

if (window.attachEvent) {
  attachEvent('load',function() {
    setTimeout(function() {
      loadHandler();
    },1);
  });
}

function loadHandler() {
  if (!window.WebSocket) {
    alert("不好意思，您的浏览器版本太低咯，请先升级浏览器哦");
    return;
  }

  ws = io.connect("http://socket.qujieyou.vocinno.com:5010");
  ws.emit('connected', "lala");
  ws.on('qrimage', function(imageUrl) {
    if (imageUrl) {
      document.getElementById("QnR-image").src= imageUrl;
    }
  });

  ws.on('login', function(data) {
    document.getElementById("login-confirm-page").style.display = "none";
    document.getElementById("editpage").style.display = "block";
    document.body.className += " editor-page";
    // document.getElementById("login-suc-note").style.display = "block";
    // setTimeout(function() {
    //   document.getElementById("login-suc-note").style.display = "none";
    //   document.getElementById("editpage").style.display = "block";
    // }, 1000);
    var userData = data;
    console.log(userData);
    if (typeof userData === "string") {
      userData = JSON.parse(userData);
    }
    setCookie("token",userData.token,0.2);
  });

  ws.on('draft', function(data) {
    var draft = JSON.parse(data);
    console.log(draft);
    if (draft.type == 2) {
      alert("网页上还只能支持文字写信，语音信件只能在客户端发送哦");
      window.location.reload();
    } else {
      renderDraft(draft);
    }
  });

  function setCookie(name, value, expire_day) {
    var expires_time = expire_day || 1; //单位是天
    var exp = new Date();
    exp.setTime(exp.getTime() + expires_time*24*3600000);
    document.cookie = name+"="+value+";expires=" + exp.toGMTString();
  }
}
