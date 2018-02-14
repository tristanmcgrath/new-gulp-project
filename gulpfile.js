const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const csswring = require('csswring');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const concatcss = require('gulp-concat-css');
const browserSync = require('browser-sync');

browserSync({
    server: {
        baseDir: './'
    },
    browser: 'google chrome'
});

gulp.task('styles', (done) => {
    gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concatcss('style.min.css'))
        .pipe(gulp.dest('./build/css'));
    done();
});

gulp.task('scripts', (done) => {
    gulp.src('./js/**/*.js')
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('./build/js'));
    done();
});

gulp.task('production-css', (done) => {
    const processors = [
        autoprefixer({ browsers: ['last 2 versions'] }),
        csswring
    ];

    gulp.src('./build/css/style.min.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./build/css'));
    done();
});

gulp.task('production-js', (done) => {
    gulp.src('./build/js/scripts.min.js')
        .pipe(babel({ presets: ['env'] }))
        .pipe(uglify({ mangle: false }).on('error', (e) => { console.log(e); }))
        .pipe(gulp.dest('./build/js'));
    done();
});

gulp.task('production', gulp.parallel('production-css', 'production-js'));

gulp.task('watch:scripts', () =>
      gulp.watch('./js/**/*.js', gulp.series('scripts', (done) => {
          browserSync.reload();
          done();
      }))
);

gulp.task('watch:sass', () =>
      gulp.watch('./sass/**/*.scss', gulp.series('styles', (done) => {
          browserSync.reload();
          done();
      }))
);

gulp.task('watch:index', () =>
      gulp.watch('./index.html', gulp.series((done) => {
          browserSync.reload();
          done();
      }))
);

gulp.task('default', gulp.series(gulp.parallel('scripts', 'styles'),
                                 gulp.parallel('watch:scripts',
                                               'watch:sass',
                                               'watch:index')));
