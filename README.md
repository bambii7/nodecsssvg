nodecsssvg
==========

A node script to aid SVGs in CSS. 

----------

## About
While wanting to adopt SVGs into the frontend development life cycle, it's currently too cumbersome to support backwards compatibility. This tool aims to automate the fallback process. By interpreting SVG files, converting them to inline data URIs, generating the PNGs and IE style sheet.


## Why
Currently encoding SVG files into a CSS file is a fairly manual process. And once this is done visibility of the asset is obscured. To update the SVG you need to re-encode the changes, find the line of CSS containing the asset, paste in the new code, then save out a PNG for fallback.

1. Keep visibility of the assets
2. Auto encode asset data for cleaner source files
3. Auto generate PNG fallbacks
