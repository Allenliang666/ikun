import urllib.request

# Check GitHub Pages availability
urls = [
    'https://allenliang666.github.io/ikun/',
    'https://allenliang666.github.io/ikun/liuyao/liuyao.html',
    'https://allenliang666.github.io/ikun/sxwnl/core.js'
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=10)
        print(url + ': ' + str(resp.status) + ' (' + resp.headers.get('Content-Type', 'unknown') + ')')
    except Exception as e:
        print(url + ': ERROR - ' + str(e))