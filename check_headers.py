import urllib.request

# Check GitHub Pages headers
url = 'https://allenliang666.github.io/ikun/liuyao/liuyao.html'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req, timeout=10)
print('Status:', resp.status)
print('Content-Type:', resp.headers.get('Content-Type'))
print()

# Check core.js
url2 = 'https://allenliang666.github.io/ikun/sxwnl/core.js'
resp2 = urllib.request.urlopen(url2, timeout=10)
print('core.js Status:', resp2.status)
print('core.js Content-Type:', resp2.headers.get('Content-Type'))

# Sample first 100 bytes to verify encoding
data = resp2.read(100)
print('\nFirst 100 bytes (hex):', data[:50].hex())
print('Decoded as UTF-8:', data.decode('utf-8')[:50])