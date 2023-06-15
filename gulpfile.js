const { src, dest, watch, parallel} = require ("gulp");

//CSS
const sass = require('gulp-sass')(require('sass'));
const plumber =require('gulp-plumber');
const autoprefixer =require('autoprefixer');
const cssnano = require ('cssnano');
const postcss = require ('gulp-postcss');
const sourcemaps =require ('gulp-sourcemaps');

//javascript

const terser =require ('gulp-terser-js');


//Imagenes
const cache = require('gulp-cache');
const imagemin = require ('gulp-imagemin');
const webp = require ('gulp-webp');
const avif = require ('gulp-avif');

function css (done){
    src("src/scss/**/*.scss") //identificar el archivo de sass
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())     //compilarlo
    .pipe (postcss([autoprefixer(), cssnano]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css"))  //Almacenarlo o guardarlo

    done();//avisa a Gulp cuando llega al final de la funcion
}

function imagenes (done) {
    const opciones = {
        optimizationLevel: 3 
    }
    src('src/img/**/*.{jpn,png}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'))
    done();
}

function versionWebp (done) {
    const opciones = {
        Quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))
    done();
}

function versionAvif (done) {
    const opciones = {
        Quality: 50
    };
    src('src/img/**/*.{png,jpg}')
    .pipe(avif (opciones))
    .pipe(dest('build/img'))
    done();
}

function javascript (done){
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel (imagenes,versionAvif, versionWebp, javascript, dev);
