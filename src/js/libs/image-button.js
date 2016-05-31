var ImageButton = MediumEditor.Extension.extend({
  name: 'imageVoc',

  contentDefault: '<b>Img</b>', // default innerHTML of the button
  contentFA: '<i class="fa fa-picture-o"></i>', // innerHTML of button when 'fontawesome' is being used
  aria: 'ImageVoc', // used as both aria-label and title attributes
  action: 'imageVoc', // used as the data-action attribute of the button

  init: function () {
    // MediumEditor.extensions.button.prototype.init.call(this);

    this.button = this.document.createElement('button');
    this.button.classList.add('medium-editor-action');
    this.button.innerHTML = '<i class="fa fa-picture-o"></i>';
    this.button.title = '添加图片';

    this.on(this.button, 'click', this.handleClick.bind(this));
  },

  getButton: function () {
    return this.button;
  },

  handleClick: function() {
    var ele = $("#editorWrap")[0]
        ,pluginName = "mediumInsert"
        ,insertCore = $.data(ele,'plugin_' + pluginName)
        ,selection = window.getSelection()
        ,focusNode = selection.focusNode
        ,$p
        ,$keyup = $.Event("keyup");

    var mEditor = window.mediumEditor;

    //焦点不在编辑框内
    if (!selection.anchorNode || $(selection.anchorNode).closest("#editor").length == 0) {
      alert("请在编辑框内插入图片");
      return;
    }

    $p = $(focusNode).closest("p").length > 0 ? $(focusNode).closest("p") : $(focusNode).closest("div");

    if (!$p.length) {
      console.log("咦，我擦嘞");
      return;
    }

    var pToAppend = null
        ,nextEle = $p[0].nextElementSibling;

    //使用isInsertingImage标志位防止换行时自动弹出加载图片事件
    mEditor.setIsInserting(true);

    if ($p.text().trim() === '') {
      //空的一行 不要添加回车 但需要触发点击事件 为了避免与toolbar中
      //的点击事件同时触发导致多次弹出输入框，使用延迟来触发隐藏按钮的点击事件
      setTimeout(function() {
        insertCore.$el.trigger("click");
      },1);
    } else {
      pToAppend = document.createElement("p");
      pToAppend.innerHTML = "<br>";

      if (!nextEle || nextEle.length == 0) {
        $p[0].parentNode.appendChild(pToAppend);
      } else {
        nextEle.parentNode.insertBefore(pToAppend, nextEle);
      }

      MediumEditor.selection.selectNode.call(mEditor, pToAppend, mEditor.options.ownerDocument);
    }
  }
});
