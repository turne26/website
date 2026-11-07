#!/usr/bin/env python3
"""Render social share images (1200x630) and app icons with headless Chromium.
Run once after changing headlines:  pip install playwright && playwright install chromium
                                    python3 src/gen_images.py
"""
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = "file://" + os.path.join(HERE, "assets", "fonts")
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

BASE_CSS = f"""
@font-face {{ font-family: PJ; font-weight: 800; src: url('{FONTS}/plus-jakarta-sans-latin-800-normal.woff2'); }}
@font-face {{ font-family: PJM; font-weight: 500; src: url('{FONTS}/plus-jakarta-sans-latin-500-normal.woff2'); }}
html, body {{ margin: 0; background: #07070c; }}
"""

MARK = ('<svg viewBox="0 0 32 32" width="{s}" height="{s}"><circle cx="16" cy="16" r="4.5" fill="#c6ff3d"/>'
        '<g stroke="#c6ff3d" stroke-width="3.2" stroke-linecap="round"><path d="M16 11.5V3"/><path d="M19.9 18.25 27.3 22.5"/>'
        '<path d="M12.1 18.25 4.7 22.5"/></g></svg>')


def og_html(title, sub):
    return f"""<html><head><style>{BASE_CSS}
.c {{ width: 1200px; height: 630px; box-sizing: border-box; padding: 64px 72px; color: #f3f2f8; position: relative; overflow: hidden; font-family: PJM, sans-serif; }}
.logo {{ display: flex; align-items: center; gap: 14px; font: 800 40px/1 PJ; letter-spacing: -.02em; }}
h1 {{ font: 800 84px/1 PJ; letter-spacing: -.045em; margin: 64px 0 0; max-width: 860px; }}
h1 span {{ color: #c6ff3d; }}
p {{ font-size: 30px; color: #9d9bb3; margin: 28px 0 0; }}
.stub {{ position: absolute; right: -40px; top: 70px; width: 230px; height: 490px; background: #8b6cff; border-radius: 18px; transform: rotate(8deg);
  display: grid; place-items: center; }}
.stub b {{ writing-mode: vertical-rl; transform: rotate(180deg); font: 800 46px/1 PJ; color: #07070c; letter-spacing: -.01em; }}
.stub::before {{ content: ""; position: absolute; left: 0; top: 0; bottom: 0; border-left: 4px dashed #07070c55; }}
</style></head><body><div class="c">
<div class="logo">{MARK.format(s=44)}TURNE</div>
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
        for name, size, pad, radius in [("apple-touch-icon", 180, .2, 0), ("icon-192", 192, .2, 0), ("icon-512", 512, .2, 0),
                                        ("icon-512-maskable", 512, .28, 0), ("favicon-32", 32, .12, 7)]:
            pg.set_viewport_size({"width": size, "height": size})
            pg.set_content(icon_html(size, pad, radius)); pg.wait_for_timeout(100)
            pg.screenshot(path=os.path.join(OUT_IMG, f"{name}.png"), omit_background=True)
        b.close()
    print("images written")


if __name__ == "__main__":
    main()
