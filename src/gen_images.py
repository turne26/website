#!/usr/bin/env python3
"""Render social share images (1200x630) and app icons with headless Chromium.
Run once after changing headlines:  pip install playwright && playwright install chromium
                                    python3 src/gen_images.py
"""
import base64
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_OG = os.path.join(HERE, "assets", "og")
OUT_IMG = os.path.join(HERE, "assets", "img")


OG = {
    "home": ("Don't just watch.<br><span>Participate.</span>", "Brand events with a room for every startup."),
    "why-turne": ("Brands shouldn't just<br>be <span>seen.</span>", "They should be experienced."),
    "how-it-works": ("A room for<br><span>every startup.</span>", "Brands host. Startups showcase. You take part."),
    "giveaways": ("Real rewards.<br><span>Real participation.</span>", "Free to enter. Fair 50/50 split."),
    "premium": ("The first 10,000 get<br><span>Premium for life.</span>", "Join the waitlist. Claim your spot."),
    "brands": ("For brands, it's more<br>than an <span>event.</span>", "Create it. Fill the room. Measure who showed up."),
    "faq": ("The <span>details.</span>", "Waitlist, Premium, giveaways and launch."),
    "contact": ("Get in <span>touch.</span>", "hello@turne.in"),
    "join": ("Join the<br><span>waitlist.</span>", "The first 10,000 get Lifetime Premium."),
}


def data_uri(*path):
    """Inline a file so the pages need no file:// access (which breaks on Windows paths)."""
    mime = "font/woff2" if path[-1].endswith(".woff2") else "image/png"
    with open(os.path.join(HERE, *path), "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode()


FONT = lambda w: data_uri("assets", "fonts", f"plus-jakarta-sans-latin-{w}-normal.woff2")  # noqa: E731

BASE_CSS = f"""
@font-face {{ font-family: PJ; font-weight: 800; src: url('{FONT(800)}'); }}
@font-face {{ font-family: PJM; font-weight: 500; src: url('{FONT(500)}'); }}
html, body {{ margin: 0; background: #07070c; }}
"""

# Large logo cut-outs from src/make_logo.py. The mark is 669x512.
MARK = '<img src="' + data_uri("brand", "logo-mark-hi.png") + '" style="width:{s}px;height:auto;display:block">'
WORD = '<img src="' + data_uri("brand", "logo-word-hi.png") + '" style="height:{h}px;width:auto;display:block">'


def og_html(title, sub):
    return f"""<html><head><style>{BASE_CSS}
.c {{ width: 1200px; height: 630px; box-sizing: border-box; padding: 64px 72px; color: #f3f2f8; position: relative; overflow: hidden; font-family: PJM, sans-serif; }}
.logo {{ display: flex; align-items: center; gap: 16px; }}
h1 {{ font: 800 84px/1 PJ; letter-spacing: -.045em; margin: 44px 0 0; max-width: 860px; }}
h1 span {{ color: #c6ff3d; }}
p {{ font-size: 30px; color: #9d9bb3; margin: 28px 0 0; }}
.stub {{ position: absolute; right: -40px; top: 70px; width: 230px; height: 490px; background: #8b6cff; border-radius: 18px; transform: rotate(8deg);
  display: grid; place-items: center; }}
.stub b {{ writing-mode: vertical-rl; transform: rotate(180deg); font: 800 46px/1 PJ; color: #07070c; letter-spacing: -.01em; }}
.stub::before {{ content: ""; position: absolute; left: 0; top: 0; bottom: 0; border-left: 4px dashed #07070c55; }}
</style></head><body><div class="c">
<div class="logo">{MARK.format(s=84)}{WORD.format(h=34)}</div>
<h1>{title}</h1><p>{sub}</p>
<div class="stub"><b>ADMIT ONE</b></div>
</div></body></html>"""


def icon_html(size, pad_ratio, radius):
    s = int(size * (1 - 2 * pad_ratio))
    return f"""<html><head><style>{BASE_CSS} .i {{ width:{size}px; height:{size}px; background:#07070c; border-radius:{radius}px; display:grid; place-items:center; }}</style></head>
<body><div class="i">{MARK.format(s=s)}</div></body></html>"""


def main():
    os.makedirs(OUT_OG, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1200, "height": 630})
        for slug, (t, s) in OG.items():
            pg.set_content(og_html(t, s)); pg.wait_for_timeout(250)
            pg.screenshot(path=os.path.join(OUT_OG, f"{slug}.png"))
        for name, size, pad, radius in [("apple-touch-icon", 180, .13, 0), ("icon-192", 192, .13, 0), ("icon-512", 512, .13, 0),
                                        ("icon-512-maskable", 512, .22, 0), ("favicon-32", 32, .04, 7)]:
            pg.set_viewport_size({"width": size, "height": size})
            pg.set_content(icon_html(size, pad, radius)); pg.wait_for_timeout(100)
            pg.screenshot(path=os.path.join(OUT_IMG, f"{name}.png"), omit_background=True)
        b.close()
    print("images written")


if __name__ == "__main__":
    main()
