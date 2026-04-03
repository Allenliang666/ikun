#!/usr/bin/env python3
# -*- coding: utf-8 -*-
data = open(r'D:\ikun-main\sxwnl\core.js', 'rb').read()
idx = data.find(b'var obb=')
print('Position:', idx)

# Find numCn
needle = b"numCn:new Array('"
start = data.find(needle, idx) + len(needle)
end = data.find(b")", start + 50)
raw_bytes = data[start:end]
print('Raw bytes (hex):', raw_bytes.hex())
print('Raw bytes:', raw_bytes)
print()

# These bytes should be Chinese characters
# Try to decode as GBK
try:
    decoded = raw_bytes.decode('gbk')
    print('GBK decoded:', decoded)
except:
    print('GBK decode failed')

# Try gb2312
try:
    decoded = raw_bytes.decode('gb2312')
    print('GB2312 decoded:', decoded)
except:
    print('GB2312 decode failed')

# Check the actual byte values - are they valid UTF-8?
# A valid UTF-8 Chinese char should be 3 bytes: 0xE0-0xEF, 0x80-0xBF, 0x80-0xBF
print()
print('Byte analysis:')
for i, b in enumerate(raw_bytes[:30]):
    if b > 127:
        print(f'  byte[{i}] = 0x{b:02x} ({b})')
    else:
        print(f'  byte[{i}] = 0x{b:02x} = {chr(b)}')
