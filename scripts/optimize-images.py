"""Turn raw screenshots into the responsive WebP files the site serves.

    python scripts/optimize-images.py <raw-dir>

Expects the PNGs written by scripts/capture-projects.mjs plus the repo
charts listed in SOURCES. Writes assets/img/work/<name>-<width>.webp.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "work"

# raw file -> (output name, widths, crop box as fractions or None)
SOURCES = {
    "ri2.png": ("ri2", (640, 1200), None),
    "tiny-editor.png": ("tiny-editor", (640, 1200), None),
    "power-bi.png": ("power-bi", (640, 1200), None),
    "pbi-experience.png": ("power-bi-experience", (640, 1200), None),
    "tiny-language-models.png": ("tiny-language-models", (640, 1200), None),
    "pytorch-playground.png": ("pytorch-playground", (640, 1200), None),
    "tinylm-curve.png": ("tinylm-training-curve", (900, 1600), None),
}


def save(img: Image.Image, name: str, width: int) -> None:
    h = round(img.height * width / img.width)
    out = OUT / f"{name}-{width}.webp"
    img.resize((width, h), Image.LANCZOS).save(out, "WEBP", quality=82, method=6)
    print(f"{out.relative_to(ROOT)}  {width}x{h}  {out.stat().st_size // 1024} KB")


def main() -> None:
    raw = Path(sys.argv[1])
    OUT.mkdir(parents=True, exist_ok=True)
    for src, (name, widths, crop) in SOURCES.items():
        path = raw / src
        if not path.exists():
            print(f"skip {src} (missing)")
            continue
        img = Image.open(path).convert("RGB")
        if crop:
            l, t, r, b = crop
            img = img.crop((int(l * img.width), int(t * img.height), int(r * img.width), int(b * img.height)))
        for w in widths:
            save(img, name, w)

    # Hero photo for the home page: 4:5, centred on the bench.
    hero = Image.open(ROOT / "src" / "assets-src" / "hero-source.jpg").convert("RGB")
    top = 120
    ch = hero.height - top
    cw = int(ch * 4 / 5)
    left = max(0, min(hero.width - cw, 600 - cw // 2))
    hero = hero.crop((left, top, left + cw, hero.height))
    for width in (480, 880):
        hh = round(hero.height * width / hero.width)
        out = ROOT / "assets" / "img" / f"hero-{width}.webp"
        hero.resize((width, hh), Image.LANCZOS).save(out, "WEBP", quality=80, method=6)
        print(f"{out.relative_to(ROOT)}  {width}x{hh}  {out.stat().st_size // 1024} KB")

    # Portrait for the About page, cropped to 4:5 around the subject.
    photo = Image.open(ROOT / "src" / "assets-src" / "portrait-source.jpg").convert("RGB")
    w, h = photo.size  # 1000 x 1060
    cw, ch = 620, 775
    left, top = (w - cw) // 2 - 10, 285
    portrait = photo.crop((left, top, left + cw, top + ch))
    out_dir = ROOT / "assets" / "img"
    for width in (400, 620):
        hh = round(ch * width / cw)
        out = out_dir / f"portrait-{width}.webp"
        portrait.resize((width, hh), Image.LANCZOS).save(out, "WEBP", quality=82, method=6)
        print(f"{out.relative_to(ROOT)}  {width}x{hh}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
