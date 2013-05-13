#!/usr/bin/env node

// require system path
var fs = require('fs');
var path = require('path');

// requires the imagemagick extension found here https://github.com/mash/node-imagemagick-native
var im = require('imagemagick-native')

// capture input
var cssFile = process.argv[2];
var outputFile = process.argv[3];
var cwd = process.cwd();

if( !cssFile || !outputFile) {
    process.abort();
}

// read css file
console.log( 'reading ' + process.argv[2] );
var cssContent = fs.readFileSync( cssFile, 'utf8' );

// cd into the working dir of the css file
process.chdir( path.dirname( cssFile ) );

var urlPattern = /url\(['"]{0,1}(.*)['"]{0,1}\)/g;

var replacedContent = cssContent.replace( urlPattern, function( match, url, id ) {
    // check the url is an svg
    if( path.extname( url ) != '.svg' )
        return false;
    
    var svgBuffer = new Buffer( fs.readFileSync( url, 'utf8' ) );
    var svg64 = svgBuffer.toString( 'base64' );
    
    var pngName = path.basename( url, '.svg') + 'png';
    
//    im.convert('' + url + ' ' + pngName );
    // returns a Buffer instance
    var pngBuffer = im.convert({
        srcData: svgBuffer, // provide a Buffer instance
        width: '100%',
        height: '100%',
        resizeStyle: "aspectfill",
        quality: 100,
        format: 'PNG'
    });
    fs.writeFileSync( pngName + '.png', pngBuffer, 'binary' );

    return "url('data:image/svg+xml;base64," + svg64 + "')";
} );

// switch back to origonal dir 
process.chdir( cwd );
fs.writeFileSync( outputFile, replacedContent );

console.log( 'writing to ' + process.argv[3] );