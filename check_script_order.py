import urllib.request

# Download the HTML
url = 'https://raw.githubusercontent.com/Allenliang666/ikun/master/liuyao/liuyao.html'
resp = urllib.request.urlopen(url, timeout=10)
html = resp.read().decode('utf-8')

# Find where the script tag is loaded relative to getSizhuFromSxwnl
script_pos = html.find('<script src="sxwnl/core.js">')
func_pos = html.find('function getSizhuFromSxwnl')

print('script tag position:', script_pos)
print('getSizhuFromSxwnl position:', func_pos)

if script_pos > 0 and func_pos > 0:
    if script_pos < func_pos:
        print('OK: core.js is loaded BEFORE getSizhuFromSxwnl')
    else:
        print('ERROR: core.js is loaded AFTER getSizhuFromSxwnl')
        
# Also check if there's a script tag BEFORE the function
before_func = html[:func_pos]
if '<script' in before_func:
    last_script = before_func.rfind('<script')
    print('Last script before function at:', last_script)
    print(html[last_script:last_script+200])
else:
    print('No script tags before function')