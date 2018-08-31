var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    count = require('gulp-count'),
    sass = require('gulp-sass'),
    pathExists = require('path-exists'),
    plumber = require('gulp-plumber'),
    pug = require('gulp-pug'),
    //cleanCSS = require('gulp-clean-css'),
    //uglify = require('gulp-uglify'),
    //minifyHTML = require('gulp-minify-html'),
    newer = require('gulp-newer'),
    notify = require('gulp-notify'),
    runSequence = require('run-sequence'),
    //tingpng = require('gulp-tinypng'),
    //imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    //base64 = require('gulp-base64'),
    //spritesmith = require('gulp.spritesmith'),
    size = require('gulp-size'),
    zip = require('gulp-zip');

var currentCreative
var sourceDirectory
var outputDirectory
//var productionDirectory

currentCreative = process.env.CURRENT_CREATIVE || 'v1';

//currentSize = process.env.CURRENT_SIZE || '300x250';
//currentSize = process.env.CURRENT_SIZE || '728x90';
//currentSize = process.env.CURRENT_SIZE || '300x600';
//currentSize = process.env.CURRENT_SIZE || '160x600';

sourceDirectory = 'src/creatives/' + currentCreative + '/' + currentSize;
outputDirectory = 'dev/' + currentCreative + '/' + currentSize + '/';
productionFolder = currentCreative + '_' + currentSize;
//productionDirectory = 'prod/' + productionFolder;

console.log('currentCreative = ' + currentCreative );
console.log('sourceDirectory = ' + sourceDirectory );
console.log('outputDirectory = ' + outputDirectory );
//console.log('productionDirectory = ' + productionDirectory );


gulp.task('connect', function() {

      connect.server({
        root: outputDirectory,
        livereload: true
      });
});

gulp.task('html', function() {


        gulp.src(sourceDirectory + '/pug/*.pug')
            .pipe(pug({
                pretty:true
            }))
            .pipe(gulp.dest(outputDirectory))
            .pipe(connect.reload());

});

gulp.task('js', function() {


        var jsSources;

        jsSources = [
                'src/global/scripts/global_functions.js',
                sourceDirectory + '/js/main.js'];

        gulp.src( jsSources )
            .pipe(concat('main.js'))
            .pipe(gulp.dest(outputDirectory))
            .pipe(connect.reload());
});

gulp.task('sass', function() {

        return gulp.src(sourceDirectory + '/sass/style.scss')
            .pipe(sass({
                sass: sourceDirectory + '/sass'
            }).on('error', gutil.log))
            .pipe(connect.reload())
            .pipe(gulp.dest(outputDirectory));

});

gulp.task('watch', function() {


        //global stuffs
        gulp.watch('src/global/scripts/*', ['js']);

        //watch css
        pathExists(sourceDirectory + '/sass/style.scss').then(exists => {
            gulp.watch(sourceDirectory + '/sass/_main.scss', ['sass']);
        });

        //watch pug
        gulp.watch('src/global/pug/base.pug', ['html']);
        gulp.watch(sourceDirectory + '/pug/index.pug', ['html']);

        //watch js
        gulp.watch(sourceDirectory + '/js/*.js', ['js']);

});


//DEVELOPMENT
gulp.task('default', ['html', 'js', 'sass', 'connect', 'watch']);
