var path = require('path')
    ,del = require('del')
    ,es = require('event-stream')
    ,gulp = require('gulp')
    ,includer = require('gulp-htmlincluder')
    ,series = require('stream-series')
    ,inject = require('gulp-inject');

var loadOptions = {
  rename: {
    'gulp-minify-css': 'minifyCss',
    'gulp-html-replace': 'htmlReplace'
  }
};

var $ = require('gulp-load-plugins')();


// set variable via $ gulp --type production
var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var packageConfig = require('./package.json');
var templateConfig = require('./template.config.js').getConfig(environment);

var port = $.util.env.port || 1337;
var app = 'src/';
var dist = 'dist/';
var modulesdir = 'node_modules/';


var genRandomName = function() {
  var seed = (new Date()).valueOf();
  return (Math.round(seed*(Math.random()+0.5))).toString(16);
};

gulp.task('html-inject',function() {
  var libJsOption ={
    ignorePath: '/dist',
    name: 'libs'
  };

  var injectOption = {
    ignorePath: '/dist'
  };

  var js_libs = templateConfig.getJsLibs(app + 'js/libs/');
  var libsStream = gulp.src(js_libs)
      .pipe($.concat('libs.js'))
      .pipe(isProduction ? $.uglify() : $.util.noop())
      .pipe($.rename(function(path) {
        path.basename = "libs-" + genRandomName() + (isProduction?".min":"");
      }))
      .pipe(gulp.dest('dist/js/libs',{mode: 0644}));

  var socketStream = gulp.src('src/js/login.main.js')
      .pipe(isProduction ? $.uglify() : $.util.noop())
      .pipe($.rename(function(path) {
        path.basename = genRandomName() + (isProduction?".min":"");
      }))
      .pipe(gulp.dest('dist/js',{mode: 0644}));

  var loadStream = gulp.src('src/js/load.main.js')
      .pipe(isProduction ? $.uglify() : $.util.noop())
      .pipe($.rename(function(path) {
        path.basename = genRandomName() + (isProduction?".min":"");
      }))
      .pipe(gulp.dest('dist/js',{mode: 0644}));

  var editStream = gulp.src('src/js/edit.main.js')
      .pipe(isProduction ? $.uglify() : $.util.noop())
      .pipe($.rename(function(path) {
        path.basename = genRandomName() + (isProduction?".min":"");
      }))
      .pipe(gulp.dest('dist/js',{mode: 0644}));

  var vendorStyleStream = gulp.src(['src/css/font-awesome.css','src/css/medium.css','src/css/normalize.css'])
      .pipe($.concat({path:'vendor.css', stat:{mode:0666}}))
      .pipe($.minifyCss())
      .pipe($.rename(function(path) {
        path.basename = genRandomName() + (isProduction?".min":"");
      }))
      .pipe(gulp.dest('dist/css', {mode: 0644}));

  var mainStyleStream = gulp.src('src/stylus/main.styl')
      .pipe($.stylus())
      .pipe(isProduction?$.minifyCss():$.util.noop())
      .pipe($.rename(function(path) {
        path.basename = genRandomName() + (isProduction?".min":"");
      }))
      .pipe(gulp.dest('dist/css',{mode: 0644}));

  return gulp.src('./src/template/*.html')
    .pipe(inject(series(libsStream),libJsOption))
    .pipe(inject(series(socketStream,loadStream,editStream,vendorStyleStream,mainStyleStream),injectOption))
    .pipe(includer())
    .pipe(gulp.dest('dist/'))
    .pipe(!isProduction ? $.notify({message:"html-inject finished"}) : $.util.noop());
});

gulp.task('storylist', function() {

});


// add livereload on the given port
gulp.task('serve', function() {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35729
    }
  });
});

//cope fonts
gulp.task('fonts', function(cb) {
  return gulp.src(app + 'fonts/*')
    .pipe(isProduction ? $.util.noop() : $.size({ title: 'fonts'}))
    .pipe(gulp.dest(dist + 'fonts/'));
});

// copy images
gulp.task('images', function(cb) {
  return gulp.src(app + 'img/**/*.{png,jpg,jpeg,gif}')
    .pipe(isProduction ? $.util.noop() : $.size({ title : 'img' }))
    .pipe(gulp.dest(dist + 'img/'));
});

// watch styl, html and js file changes
gulp.task('watch', function() {
  gulp.watch(app + 'css/*.css', ['html-inject']);
  gulp.watch(app + 'template/*.html', ['html-inject']);
  gulp.watch(app + 'js/**/*.js', ['html-inject']);
  gulp.watch(app + 'img/*', ['images']);
});

// remove bundles
gulp.task('clean', function(cb) {
  del([dist], cb);
});

// by default build project and then watch files in order to trigger livereload
// gulp.task('default', $.sequence('images', 'html-inject', 'watch'));
gulp.task('default', ['images', 'fonts', 'html-inject', 'serve', 'watch']);

gulp.task('deploy', ['images', 'fonts', 'html-inject']);
