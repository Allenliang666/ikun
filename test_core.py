#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import urllib.request
import json

# Download core.js from GitHub Pages
url = 'https://allenliang666.github.io/ikun/sxwnl/core.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req, timeout=15)
js_code = resp.read().decode('utf-8')
print('Downloaded size:', len(js_code))
print('Has obb:', 'var obb=' in js_code)
print('Has mingLiBaZi:', 'mingLiBaZi' in js_code)

# Check if obb.numCn contains proper Chinese
idx = js_code.find("numCn:new Array('")
if idx >= 0:
    snippet = js_code[idx:idx+100]
    print('\nnumCn snippet:')
    print(snippet)
    print()
    # Check for replacement characters
    if '\ufffd' in snippet:
        print('WARNING: Found replacement characters (decoding errors)')
    else:
        print('No decoding errors in this snippet')

# Check Content-Type header
print('\nContent-Type:', resp.headers.get('Content-Type', 'not set'))
