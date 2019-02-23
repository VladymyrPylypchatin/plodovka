var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    plumber = require('gulp-plumber'),
    run = require('run-sequence');

// Compile sass
gulp.task('sass', function () {
     gulp.src(['source/assets/sass/main.scss'])
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer(['last 5 versions'], {cascade: true}))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.reload({stream: true}))
});

// Compress css libs
gulp.task('css-libs', function () {
   return gulp.src('source/assets/sass/libs.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/assets/css'));
});

// Build css
gulp.task("build-css", function () {
    run('sass', 'css-libs')
});

//Compress js
gulp.task('scripts', function () {
    return gulp.src('source/assets/js/*.js')
        .pipe(uglify())
       .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.reload({stream: true}));
});

//Compress js libs
gulp.task('scripts-libs', function () {
    return gulp.src([
        'source/assets/libs/jquery/dist/jquery.min.js',
        'source/assets/libs/Magnific-Popup-master/dist/jquery.magnific-popup.min.js',
        'source/assets/libs/phonemask/jquery.mask.min.js',
        // 'source/assets/libs/jquery.mmenu/dist/jquery.mmenu.js',
        // 'source/assets/libs/owlcarusel/owl.carousel.min.js',
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
});


//Browser sync
gulp.task('browser-sync', function () {
    browserSync({ // 
        proxy: 'http://plodovka/',
        port: 3000,
        notify: true // 
    });

});



//Compress images
gulp.task('img', function () {
    return gulp.src(['source/assets/img/*.*'], ['!source/assets/img/svg'])
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/assets/img/'));
});

gulp.task('fonts', function () {
    return gulp.src('source/assets/fonts/**/*')
           .pipe(gulp.dest('dist/assets/fonts/'));
});


//Creating svg sprite
gulp.task('svgSprite', function () {
    return gulp.src('source/assets/img/svg/**/*.svg')
    // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "assets/img/svg/sprite.svg",
                    render: {
                        scss: {
                            dest: 'sass/_sprite.scss',
                            template: "source/assets/sass/_sprite-template.scss"
                        }
                    }
                }

            }

        }))
        .pipe(gulp.dest('source/assets/'));
});


// Clean build
gulp.task('clean', function () {
    return del.sync('dist');
});

//Clean cahe
gulp.task('clear', function () {
    return cache.clearAll();
});

// Transport html
gulp.task('html', function () {
    return gulp.src(['source/*.html', 'source/*.php']).
    pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
});

// Transport html
gulp.task('utils', function () {
    return gulp.src(['source/utils/**/*']).
    pipe(gulp.dest('dist/utils/'));
});

//Watch
gulp.task('watch', ['build', 'browser-sync', ], function () {
    gulp.watch('source/assets/sass/**/*.scss', ['sass']);
    //gulp.watch('source/assets/img/svg/**/*.svg', ['svgSprite']);//test
    gulp.watch('source/assets/img/**/*.*', ['img']);//test
    gulp.watch('source/*.html', ['html']);
    gulp.watch('source/*.php', ['html']);
    gulp.watch('source/assets/js/**/*.js', ['scripts']);
    gulp.watch('source/assets/fonts/**/*', ['fonts']);
});

//Build
gulp.task('build', ['clean', 'html', 'utils', 'sass', 'css-libs', 'scripts-libs',  'scripts', 'img', 'fonts'], function () {
    // var buildCss = gulp.src([
    //     'source/assets/css/main.css',
    //     'source/assets/css/libs.min.css',
    // ])
    //     .pipe(gulp.dest('dist/assets/css'));

    // var buildFonts = gulp.src('source/assets/fonts/**/*')
    //     .pipe(gulp.dest('dist/assets/fonts'));

    // var buildJs = gulp.src('source/assets/js/**/*')
    //     .pipe(gulp.dest('dist/assets/js'));

    // var buildHTML = gulp.src('source/*.html').pipe(gulp.dest(''));
});

