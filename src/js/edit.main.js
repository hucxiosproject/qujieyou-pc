if (window.addEventListener) {
  addEventListener('load',function() {
    setTimeout(function() {
      mediumInit();
    },1);
  });
}

if (window.attachEvent) {
  attachEvent('load',function() {
    setTimeout(function() {
      mediumInit();
    },1);
  });
}

function mediumInit() {
  var editorWrap = document.getElementById("editorWrap");
  var mediumEditor = new MediumEditor('#editor', {
    toolbar: {
      // buttons: ['bold', 'italic', 'underline', 'imageVoc', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'orderedlist', 'unorderedlist', 'h1', 'h2'],
      buttons: ['bold', 'italic', 'underline', 'imageVoc', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'orderedlist', 'unorderedlist', 'h1', 'h2'],
      static: true,
      sticky: true
    },
    buttonLabels: 'fontawesome',
    elementsContainer: editorWrap,
    extensions: {
      'imageVoc': new ImageButton()
    }
  });

  window.mediumEditor = mediumEditor;

  $(function () {
      $('#editorWrap').mediumInsert({
          editor: mediumEditor,
          addons: {
              images: {
                  styles: {
                      slideshow: {
                          label: '<span class="fa fa-play"></span>',
                          added: function ($el) {
                              $el
                                  .data('cycle-center-vert', true)
                                  .cycle({
                                      slides: 'figure'
                                  });
                          },
                          removed: function ($el) {
                              $el.cycle('destroy');
                          }
                      }
                  },
                  actions: false
              }
          }
      });
  });
}

function renderDraft(draft) {
  window.draft = draft;
  document.getElementById("editor").innerHTML = draft.content;
  mediumInit();
}


function saveDraft() {
  var text = document.getElementById("editor").innerHTML;
  var data = {};

  if (window.draft) {
    data.id = window.draft.id || window.draft._id;
    data.mailboxId = window.draft.mailboxId;
  }

  data.token = getCookie("token");
  data.type = 1;
  data.content = text;

  var type = data.id ? "put":"post";

  $.ajax({
    url: "http://story.qujieyou.vocinno.com/session/draft",
    type: type,
    data: data,
    success: function(data) {
      if (data) {
        console.log("保存成功");
        window.draft = data;
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function getStory() {
  var url = "story.qujieyou.vocinno.com/session/storys?sort=priority";
  $.ajax({
    url: url,
    type: "get",
    success: function(data) {
      console.log(data);
    },
    error: function(err) {
      console.log(err);
    }
  })
}

function sendMail() {
  console.log("xcznaifjvieoj");
  var content = document.getElementById("editor").innerHTML;
  var data = {
    token: getCookie("token"),
    type: 1,
    content: content
  };

  if (window.draft && (window.draft._id||window.draft.id)){
    data.draftId = window.draft._id||window.draft.id;
  }

  $.ajax({
    url: "http://story.qujieyou.vocinno.com/session/mailbox",
    type: "post",
    data: data,
    success: function(data) {
      console.log(data);
      if (confirm("发送成功")) {
        // window.location.href = "/stories";
        window.location.reload();
      }
    },
    error: function(err) {
      console.log("asodjcifvj");
    }
  })

}
