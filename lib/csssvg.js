#!/usr/bin/env node

/**
 * TODO:
 * - seperate out the functions
 *      - encode svg (utf8, urlencoded, base64)
 *      - encode png (base64)
 *      - converte svg to png with imagemagick
 *      - build ie style sheet
 * - in the ie8 sheet only save out the background attributes
 * - save pngs as transparent 
 */

// require system path
var fs = require('fs');
var path = require('path');

// requires the imagemagick extension found here https://github.com/mash/node-imagemagick-native
var im = require('imagemagick-native')

// capture input
var cssFile = process.argv[2];
var cssDir = path.dirname( cssFile ) + '/';
var outputFile = process.argv[3];
var outputDir = path.dirname( outputFile ) + '/';
//var cwd = process.cwd();

if( !cssFile || !outputFile) {
    process.abort();
}

// read css file
console.log( 'reading ' + process.argv[2] );
var cssContent = fs.readFileSync( cssFile, 'utf8' );

var urlPattern = /url\(['"](.*)['"]\)/g;

var svgEncodedCSS = cssContent.replace( urlPattern, function( match, url, id ) {
    // check the url is an svg
    console.log( url );
    if( path.extname( url ) != '.svg' )
        return false;
    
    var svgBuffer = new Buffer( fs.readFileSync( path.normalize( cssDir + url ), 'utf8' ) );
    var svg64 = svgBuffer.toString( 'base64' );
    return "url('data:image/svg+xml;base64," + svg64 + "')";
} );

var pngEncodedCSS = cssContent.replace( urlPattern, function( match, url, id ) {
    // check the url is an svg
    if( path.extname( url ) != '.svg' )
        return false;
    
    // read svg
    var svgcontents = fs.readFileSync( path.normalize( cssDir + url ), 'utf8' );
    // check if it has a valid xml header (required for imagemagick not broswers)
    if( svgcontents.slice(0, 5) != '<?xml')
        svgcontents = '<?xml version="1.0"?>' + svgcontents
    
    var svgBuffer = new Buffer( svgcontents );
    var pngName = path.basename( url, '.svg' );
    
    // returns a Buffer instance
    var pngBuffer = im.convert({
        srcData: svgBuffer,
        width: '100%',
        height: '100%',
        quality: 100,
        format: "PNG32"
    });
    fs.writeFileSync( outputDir + pngName + '.png', pngBuffer, 'binary' );

    return "url('data:image/png;base64," + pngBuffer.toString( 'base64' ) + "')";
} );

// >ie7 fallback
// ie7 doesn't support data URI
var pngCSS = cssContent.replace( urlPattern, function( match, url, id ) {
    // check the url is an svg
    if( path.extname( url ) != '.svg' )
        return false;
    
    var svgBuffer = new Buffer( fs.readFileSync( path.normalize( cssDir + url ), 'utf8' ) );
    var pngName = path.basename( url, '.svg' );
    
    return "url('" + pngName + ".png')";
} );

// wirte the 
fs.writeFileSync( outputFile, svgEncodedCSS );
fs.writeFileSync( outputDir + 'ie8up-svg-encoded.css', svgEncodedCSS );
fs.writeFileSync( outputDir + 'ie7down-svg-encoded.css', pngCSS );

console.log( 'writing to ' + process.argv[3] );