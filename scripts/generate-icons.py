"""Regenerate scaled PWA/Android icons from the approved game artwork.

Requires Pillow only when the artwork changes. Generated PNGs are committed.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
source = root / 'assets' / 'leadership-icon-v2.png'

with Image.open(source) as artwork:
    artwork = artwork.convert('RGBA')
    for size in (192, 512):
        target = root / 'assets' / f'icon-{size}.png'
        artwork.resize((size, size), Image.Resampling.LANCZOS).save(target, optimize=True)
        print(f'Updated {target.name}')
