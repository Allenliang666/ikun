import urllib.request
import json

# Fetch the HTML
url = 'https://raw.githubusercontent.com/Allenliang666/ikun/master/liuyao/liuyao.html'
resp = urllib.request.urlopen(url, timeout=10)
html = resp.read().decode('utf-8')

# Check if core.js is loaded
script_tag = 'sxwnl/core.js'
print('core.js in HTML:', script_tag in html)

# Check the getSizhuFromSxwnl function
start = html.find('function getSizhuFromSxwnl')
end = html.find('function getDayGanZhi', start)
if start >= 0 and end > start:
    script_section = html[start:end]
    print('--- getSizhuFromSxwnl function snippet ---')
    print(script_section[:2000])