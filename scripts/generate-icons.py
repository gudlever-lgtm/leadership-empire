"""Regenerate PWA/Android PNG icons from the canonical Leadership Empire SVG.

Requires Inkscape CLI only when the artwork changes. Generated PNGs are committed,
so normal web and Android builds do not need Inkscape.
"""
from pathlib import Path
import shutil
import subprocess

root = Path(__file__).resolve().parent.parent
svg = root / 'assets' / 'leadership-icon.svg'
inkscape = shutil.which('inkscape')
if not inkscape:
    raise SystemExit('Inkscape mangler i PATH. Ikonerne er allerede inkluderet i repositoryet.')

for size in (192, 512):
    target = root / 'assets' / f'icon-{size}.png'
    subprocess.run([
        inkscape, str(svg), '--export-type=png',
        f'--export-filename={target}', f'--export-width={size}',
        f'--export-height={size}'
    ], check=True)
    print(f'Updated {target.name}')
