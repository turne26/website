#!/usr/bin/env python3
"""Cut the Turne logo out of its artwork (src/brand/turne-logo.jpg) into transparent PNGs.

    python src/make_logo.py
      assets/img/logo-mark.png, logo-word.png   sized for the site header, footer and phone mock
      brand/logo-mark-hi.png, logo-word-hi.png  large copies gen_images.py and make_video.py use

The artwork is a light logo on a dark purple background. Alpha comes from how far each
pixel rises above that background, so the logo keeps its colours and soft edges. Re-run
it if the artwork changes, then src/gen_images.py and src/build.py.
"""
import os

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "brand", "turne-logo.jpg")
OUT = os.path.join(HERE, "assets", "img")

# Crop boxes in the 1254x1254 artwork: (left, top, right, bottom)
MARK = (330, 225, 1012, 756)    # the T, orbit and sparkle
WORD = (166, 776, 1086, 940)    # the TURNE wordmark
LOW, HIGH = 45, 100             # background level -> fully opaque level


def cut(img, box, height):
    rgb = np.asarray(img.crop(box)).astype(np.float32)
    # Blue counts for less: the background is a dark violet, the logo is bright.
    v = np.maximum(np.maximum(rgb[..., 0], rgb[..., 1]), rgb[..., 2] * 0.6)
    a = np.clip((v - LOW) / (HIGH - LOW), 0, 1)
    a = a * a * (3 - 2 * a)
    out = Image.fromarray(np.dstack([rgb, a * 255]).round().astype(np.uint8))
    bbox = out.getchannel("A").point(lambda x: 255 if x > 8 else 0).getbbox()
    out = out.crop(bbox)
    w = round(out.width * height / out.height)
    return out.resize((w, height), Image.LANCZOS)


def main():
    img = Image.open(SRC).convert("RGB")
    out = {
        os.path.join(OUT, "logo-mark.png"): cut(img, MARK, 120),
        os.path.join(OUT, "logo-word.png"): cut(img, WORD, 66),
        os.path.join(HERE, "brand", "logo-mark-hi.png"): cut(img, MARK, 512),
        os.path.join(HERE, "brand", "logo-word-hi.png"): cut(img, WORD, 160),
    }
    for path, im in out.items():
        im.save(path, optimize=True)
        print(os.path.relpath(path, HERE), im.size, os.path.getsize(path) // 1024, "KB")


if __name__ == "__main__":
    main()
