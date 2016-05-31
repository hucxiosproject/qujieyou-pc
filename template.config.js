module.exports.getConfig = function(env) {
  var isProduction = env === "production";

  var config = {
    replace: {
      'main-css': 'src/template/meta.html'
    },
    include: {

    },
    getJsLibs: function(path) {
      return [
          path + 'common.js',
          path + 'socket.io.js',
          path + 'jquery.js',
          path + 'jquery.ui.widget.js',
          path + 'jquery.iframe-transport.js',
          path + 'jquery.fileupload.js',
          path + 'handlebars.runtime.js',
          path + 'jquery-sortable.js',
          path + 'jquery.cycle2.js',
          path + 'jquery.cycle2.center.min.js',
          path + 'handlebars.js',
          // path + 'modernizr-custom.min.js',
          path + 'medium-editor.js',
          path + 'medium-editor-insert-plugin.js',
          path + 'image-button.js'
      ];
    }
  };

  return config;
}
