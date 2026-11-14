"""Render simple native app icons from the matching SVG crown geometry."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
scale = 4
base = 512
size = base * scale
im = Image.new('RGBA', (size, size), '#125653')
d = ImageDraw.Draw(im)
def pt(coords):
    return [(round(x * scale), round(y * scale)) for x, y in coords]

d.rounded_rectangle((0, 0, size - 1, size - 1), radius=106 * scale, fill='#125653')
crown = [(76,192),(139,244),(222,129),(294,244),(378,192),(413,347),(97,347)]
d.polygon(pt(crown), fill='#f6bd64')
d.line(pt(crown + [crown[0]]), fill='#ffdb96', width=10 * scale, joint='curve')
d.line(pt([(123,374),(393,374)]), fill='#fbe2af', width=24 * scale, joint='curve')
for x,y in [(139,193),(222,129),(294,244),(378,193)]:
    d.ellipse(((x-17)*scale,(y-17)*scale,(x+17)*scale,(y+17)*scale), fill='#ffdb96')
for target in (192, 512):
    im.resize((target,target), Image.Resampling.LANCZOS).save(root / 'assets' / f'icon-{target}.png', optimize=True)
