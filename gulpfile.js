const gulp            = require( "gulp" );
const include         = require( "gulp-include" );
const sass            = require( "gulp-sass" );
const Fiber           = require( "fibers" );
const del             = require( "del" );
const file            = require( "gulp-file" );
const { rollup }      = require( "rollup" );
const commonjs        = require( "@rollup/plugin-commonjs" );
const { nodeResolve } = require( "@rollup/plugin-node-resolve" );
const { babel }       = require( "@rollup/plugin-babel" );
const json            = require( "@rollup/plugin-json" );
const { terser }      = require( "rollup-plugin-terser" );

sass.compiler = require( "sass" );

function cleanDist() {
    return del( "dist/**/*" );
}

function buildHTML() {
    return gulp.src( "src/*.html" )
        .pipe( include() )
        .pipe( gulp.dest( "dist/" ) );
}

function buildAssets() {
    return gulp.src( "src/assets/**" )
        .pipe( gulp.dest( "dist/assets/" ) );
}

function buildStyle() {
    return gulp.src( "src/style/**.scss" )
        .pipe( sass( { outputStyle: "compressed", fiber: Fiber } ).on( "error", sass.logError ) )
        .pipe( gulp.dest( "dist/style/" ) );
}

function buildScript({format = "es"}) { //format: es, umd, cjs, iife
    return () => rollup( {
        input:   "src/scripts/main.js", // notre fichier source au format ESM
        plugins: [
            commonjs(), // prise en charge de require
            json(), // prise en charge des json
            nodeResolve(), // prise en charge des modules depuis node_modules
            babel( { presets: ["@babel/env"], babelHelpers: "bundled" } ), // transpilation
            terser(), // minification
        ],
    } ).then( bundle => {
        return bundle.generate( {
            format,
            file: `index.${format}.min.js`,
            name: "app",
        } );
    } ).then( ( { output } ) => {
        for ( const chunkOrAsset of output ) {
            if ( chunkOrAsset.type === "asset" ) {
                file( "scripts/" + chunkOrAsset.fileName, chunkOrAsset.source, { src: true } ).pipe( gulp.dest( "dist/" ) );
            } else {
                file( "scripts/" + chunkOrAsset.fileName, chunkOrAsset.code, { src: true } ).pipe( gulp.dest( "dist/" ) );
            }
        }

    } );
}

function watch() {
    gulp.watch( "src/*.html", buildHTML );
    gulp.watch( "src/html/**.html", buildHTML );
    gulp.watch( "src/assets/**", buildAssets );
    gulp.watch( "src/style/**.scss", buildStyle );
    gulp.watch( "src/scripts/**/*", buildScript({format: 'es'}) );
}


exports.clean   = cleanDist;
exports.watch   = gulp.series( watch );
exports.default = gulp.series( cleanDist, buildHTML, buildAssets, buildStyle, buildScript({format: 'iife'}), buildScript({format: 'es'}) );
