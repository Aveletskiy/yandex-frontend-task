var gulp        = require('gulp'),

    less        = require('gulp-less'),
    jade        = require('gulp-jade'),
    watch       = require('gulp-watch'),
    debug       = require('gulp-debug'),
    plumber     = require('gulp-plumber'),
    livereload  = require('gulp-livereload'),
    tinylr      = require('tiny-lr'),
    cleanCSS    = require('gulp-clean-css'),
    fontAwesome = require('node-font-awesome')

    server      = tinylr()
    path        = require('path');

var paths = {
    source: './src',
    destination: './dist'
};


gulp.task('build-bootstrap',function(){
    gulp.src(paths.source+'/less/bootstrap.less')
        .pipe(plumber())
        .pipe(less(
            {
                paths: [
                    path.join(__dirname, 'less', 'includes'),
                    '.',
                    './node_modules/bootstrap-less'
                ]
            }
        ))
        .pipe(debug(
            {
                title: '*.less files changed'
            }
        ))
        .pipe(gulp.dest(paths.destination+'/css'))
        .pipe(livereload( server ));
});


gulp.task('less',function(){
    gulp.src(paths.source+'/less/style.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(debug(
            {
                title: '*.less files changed'
            }
        ))
        .pipe(gulp.dest(paths.destination+'/css'))
        .pipe(livereload( server ));
});

gulp.task('jade', function() {
    gulp.src(paths.source+'/jade/_index.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(debug(
            {
                title: 'jaded:'
            }
        ))
        .pipe(gulp.dest(paths.destination+'/'))
        .pipe( livereload( server ));
});

gulp.task('minify-css', function() {
    gulp.src(paths.destination+'/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(cleanCSS({debug:true},function(details){
                debug({
                    title: details.name+': '+details.stats.originalSize,
                    title: details.name+': '+details.stats.minifiedSize
                })
            }
        ))
        .pipe(gulp.dest(paths.destination+'/css'));
});

gulp.task('copy-bootstrap.js', function() {
    gulp.src('./node_modules/bootstrap-less/js/bootstrap.min.js')
        .pipe(gulp.dest(paths.destination+'/js'));
});

gulp.task('copy-glyphicon', function() {
    gulp.src('./node_modules/bootstrap-less/fonts/*.*')
        .pipe(gulp.dest(paths.destination+'/fonts'));
});

gulp.task('get-fonts',function(){
    gulp.src(fontAwesome.fonts)
        .pipe(gulp.dest(paths.destination+'/fonts'))
});

gulp.task('copy-font-awesome.min.css',function(){
    gulp.src(fontAwesome.css)
        .pipe(gulp.dest(paths.destination+'/css'));
});

gulp.task('give-fontAwesome', ['get-fonts','copy-font-awesome.min.css']);

gulp.task('watch', function () {
    server.listen(35729, function (err) {
        if (err) {
            return console.log(err);
        }

        gulp.watch(paths.source+'/less/*.less', ['less']);

        gulp.watch(paths.source+'/**/*.jade',['jade']);

    });
});

gulp.task('default', ['jade','less','watch']);