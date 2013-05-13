#!/usr/bin/env node

// require system path
var fs = require('fs');
var path = require('path');

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
    
    var svg = fs.readFileSync( url, 'utf8' );
    var svg64 = new Buffer( svg ).toString( 'base64' );
    console.log( svg.length );
    return "url('data:image/svg+xml;base64," + svg64 + "')";
} );

// switch back to origonal dir 
process.chdir( cwd );
fs.writeFileSync( outputFile, replacedContent );

console.log( 'writing to ' + process.argv[3] );