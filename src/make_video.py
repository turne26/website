#!/usr/bin/env python3
"""Render the Turne explainer video (1920x1080, 30 fps, H.264) from the live site animation.

    python3 src/build.py            # build dist/ first
    python3 src/make_video.py       # -> video/turne-explainer.mp4  (needs playwright + ffmpeg)
    python3 src/make_video.py --stills 8.6 18.4   # only save preview frames

The middle scene is the exact animation on the website (assets/js/explainer.js), seeked
frame by frame, so the video always matches the site.
"""
import argparse
import http.server
import os
import shutil
import subprocess
import sys
import threading
from functools import partial

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from layout import explainer, MARK  # noqa: E402

W, H, FPS = 1920, 1080, 30
INTRO, MAIN, OUTRO = 3.0, 25.0, 4.5
X264 = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS)]
NIGHT = "0x07070c"
WORK = os.path.join(ROOT, "video", "_work")
PORT = 8799


def page(body, extra_css="", scripts=""):
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="/dist/assets/css/site.css">
<style>
html, body {{ width: {W}px; height: {H}px; overflow: hidden; margin: 0; }}
.film-logo {{ position: absolute; left: 170px; top: 64px; z-index: 5; font-size: 1.9rem; }}
.film-url {{ position: absolute; left: 170px; bottom: 60px; z-index: 5; color: var(--muted); font-weight: 600; font-size: 1.25rem; }}
.card {{ width: {W}px; height: {H}px; padding: 0 170px; display: grid; align-content: center; gap: 2.5rem; position: relative; overflow: hidden; }}
.card h1 {{ font-size: 9.2rem; line-height: .98; }}
.card p {{ font-size: 2.1rem; color: var(--muted); max-width: 30em; }}
.card .logo {{ font-size: 3.4rem; }}
.card .logo svg {{ width: 44px; height: 44px; }}
.card .stub {{ position: absolute; right: -60px; top: 120px; width: 330px; height: 840px; border-radius: 26px; background: var(--violet); transform: rotate(9deg); display: grid; place-items: center; }}
.card .stub b {{ writing-mode: vertical-rl; transform: rotate(180deg); font: 800 5.2rem/1 var(--display); color: #fff; letter-spacing: -.02em; }}
.card .stub::before {{ content: ""; position: absolute; left: 0; top: 0; bottom: 0; border-left: 6px dashed rgba(7,7,12,.35); }}
.card .pill {{ display: inline-flex; align-items: center; gap: 1rem; font: 800 3.4rem/1 var(--display); letter-spacing: -.03em; color: var(--night); background: var(--lime); padding: 1.6rem 3rem; border-radius: 12px; justify-self: start; }}
{extra_css}
</style></head><body>{body}{scripts}</body></html>"""


def logo():
    return f'<span class="logo"><span class="hl-m">{MARK}</span>TURNE</span>'


def write_pages():
    os.makedirs(WORK, exist_ok=True)
    film = page(
        f'<a class="logo film-logo"><span class="hl-m">{MARK}</span>TURNE</a>{explainer(film=True)}<p class="film-url">turne.in</p>',
        scripts='<script src="/dist/assets/js/explainer.js"></script>')
    film = film.replace("{{a}}", "/dist/assets/").replace("{{u:join}}", "#")
    intro = page(f"""<div class="card">{logo()}<h1>Don't just watch.<br><span class="hl-m">Participate.</span></h1>
<p>Brands host events. Every startup gets its own room. You walk in and take part.</p>
<div class="stub"><b>ADMIT ONE</b></div></div>""")
    outro = page(f"""<div class="card">{logo()}<h1>Get in before<br><span class="hl-m">everyone else.</span></h1>
<span class="pill">Join at turne.in</span>
<p>The first 10,000 people on the waitlist get Lifetime Premium.</p>
<div class="stub"><b>ADMIT ONE</b></div></div>""")
    for name, html in (("film.html", film), ("intro.html", intro), ("outro.html", outro)):
        with open(os.path.join(WORK, name), "w", encoding="utf-8") as f:
            f.write(html)


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = partial(Quiet, directory=ROOT)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def encode_still(png, out, dur):
    tmp = out[:-4] + ".part.mp4"
    vf = f"format=yuv420p,loop=-1:1,trim=duration={dur},fade=in:st=0:d=0.5:color={NIGHT},fade=out:st={dur - 0.5}:d=0.5:color={NIGHT}"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", png, "-vf", vf, *X264, tmp], check=True)
    os.replace(tmp, out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stills", nargs="*", type=float, help="save preview frames at these times instead of rendering")
    args = ap.parse_args()
    from playwright.sync_api import sync_playwright

    write_pages()
    srv = serve()
    base = f"http://127.0.0.1:{PORT}/video/_work/"
    out_dir = os.path.join(ROOT, "video")
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": W, "height": H})
        errors = []
        pg.on("pageerror", lambda e: errors.append(str(e)))

        if args.stills is not None:
            for name in ("intro", "outro"):
                pg.goto(base + name + ".html"); pg.wait_for_timeout(500)
                pg.screenshot(path=os.path.join(WORK, f"still-{name}.png"))
            pg.goto(base + "film.html"); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(500)
            for t in args.stills:
                pg.evaluate(f"TurneExplainer.seek({t})")
                pg.screenshot(path=os.path.join(WORK, f"still-{t}.png"))
            print("stills in", WORK, errors or "")
            b.close(); srv.shutdown(); return

        # intro + outro cards
        for name, dur in (("intro", INTRO), ("outro", OUTRO)):
            pg.goto(base + name + ".html"); pg.wait_for_timeout(500)
            png = os.path.join(WORK, name + ".png")
            pg.screenshot(path=png)
            encode_still(png, os.path.join(WORK, name + ".mp4"), dur)

        # main scene: seek the site animation frame by frame
        pg.goto(base + "film.html"); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(600)
        pg.evaluate("TurneExplainer.measure()")
        frames = int(MAIN * FPS)
        tmp = os.path.join(WORK, "main.part.mp4")
        vf = f"fade=in:st=0:d=0.4:color={NIGHT},fade=out:st={MAIN - 0.5}:d=0.5:color={NIGHT},format=yuv420p"
        enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS),
                                "-c:v", "mjpeg", "-i", "-", "-vf", vf, *X264, tmp], stdin=subprocess.PIPE)
        for i in range(frames):
            pg.evaluate(f"TurneExplainer.seek({i / FPS})")
            enc.stdin.write(pg.screenshot(type="jpeg", quality=92))
            if i % 150 == 0:
                print(f"frame {i}/{frames}", flush=True)
        enc.stdin.close()
        if enc.wait() != 0:
            raise SystemExit("ffmpeg failed on the main scene")
        os.replace(tmp, os.path.join(WORK, "main.mp4"))
        b.close()
    srv.shutdown()
    if errors:
        print("page errors:", errors)

    # join the three scenes
    lst = os.path.join(WORK, "list.txt")
    with open(lst, "w") as f:
        for n in ("intro", "main", "outro"):
            f.write(f"file '{os.path.join(WORK, n + '.mp4')}'\n")
    final = os.path.join(out_dir, "turne-explainer.mp4")
    tmp = final[:-4] + ".part.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy",
                    "-movflags", "+faststart", tmp], check=True)
    os.replace(tmp, final)
    shutil.rmtree(WORK, ignore_errors=True)
    print("wrote", final)


if __name__ == "__main__":
    main()
