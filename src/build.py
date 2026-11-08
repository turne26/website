#!/usr/bin/env python3
"""Build the Turne static site.

  python3 src/build.py            -> dist/     production build (clean URLs: /premium/)
                                  -> preview/  flat build for file previews (premium.html)

No dependencies beyond Python 3.8+. Edit content in pages.py / legal.py, styles in
assets/css/site.css, backend URL in assets/js/config.js.
"""
import os
import re
import shutil
import sys
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from layout import SITE, THEME, head, header, footer  # noqa: E402
from pages import PAGES  # noqa: E402
import legal  # noqa: E402,F401  (registers privacy, terms, 404)

ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(HERE, "assets")


def link(slug, mode):
    if mode == "prod":
        return "/" if not slug else f"/{slug}/"
    return "index.html" if not slug else f"{slug}.html"


def resolve(html, mode):
    html = re.sub(r"\{\{u:([a-z0-9-]*)\}\}", lambda m: link(m.group(1), mode), html)
    html = html.replace("{{a}}", "/assets/" if mode == "prod" else "assets/")
    leftover = re.findall(r"\{\{[^}]*\}\}", html)
    if leftover:
        raise SystemExit(f"Unresolved tokens: {set(leftover)}")
    return html


def scripts(page):
    names = ["config.js", "api.js", "site.js"]
    if 'data-api="' in page["body"]:
        names.append("forms.js")
    if "data-explainer" in page["body"]:
        names.append("explainer.js")
    names += page.get("scripts", [])
    return "\n".join(f'<script src="{{{{a}}}}js/{n}" defer></script>' for n in names)


def render(page, mode):
    head_html = head(page, mode)
    body_html = f"""{header(page)}
<main id="main">
{page["body"].strip()}
</main>
{footer(page)}
{scripts(page)}"""
    if mode == "preview" and page["slug"] == "":
        # The preview host wraps this file in its own document skeleton.
        return resolve(f"{head_html}\n{body_html}\n", mode)
    return resolve(f"""<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{head_html}
</head>
<body>
{body_html}
</body>
</html>
""", mode)


def out_path(page, mode):
    if page.get("out"):
        return page["out"]
    if mode == "prod":
        return "index.html" if not page["slug"] else os.path.join(page["slug"], "index.html")
    return "index.html" if not page["slug"] else f"{page['slug']}.html"


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def build(mode):
    out = os.path.join(ROOT, "dist" if mode == "prod" else "preview")
    shutil.rmtree(out, ignore_errors=True)
    shutil.copytree(ASSETS, os.path.join(out, "assets"), ignore=shutil.ignore_patterns("README.txt"))
    for p in PAGES:
        write(os.path.join(out, out_path(p, mode)), render(p, mode))

    today = date.today().isoformat()
    write(os.path.join(out, "site.webmanifest"), f"""{{
  "name": "Turne",
  "short_name": "Turne",
  "description": "Discover events, join experiences, enter giveaways and connect with brands.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "{THEME}",
  "theme_color": "{THEME}",
  "icons": [
    {{ "src": "/assets/img/icon-192.png", "sizes": "192x192", "type": "image/png" }},
    {{ "src": "/assets/img/icon-512.png", "sizes": "512x512", "type": "image/png" }},
    {{ "src": "/assets/img/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }}
  ]
}}
""")
    if mode != "prod":
        return out

    prio = {"": "1.0", "join": "0.9", "premium": "0.8", "giveaways": "0.8", "how-it-works": "0.8",
            "why-turne": "0.7", "brands": "0.7", "faq": "0.7", "contact": "0.5", "privacy": "0.3", "terms": "0.3"}
    urls = "".join(
        f"  <url><loc>{SITE}{link(p['slug'], 'prod')}</loc><lastmod>{today}</lastmod><priority>{prio.get(p['slug'], '0.5')}</priority></url>\n"
        for p in PAGES if not p.get("noindex"))
    write(os.path.join(out, "sitemap.xml"),
          f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
    write(os.path.join(out, "robots.txt"), f"User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: {SITE}/sitemap.xml\n")

    # Old URLs from the previous site keep their search ranking.
    redirects = [("/index.html", "/"), ("/privacy.html", "/privacy/"), ("/terms.html", "/terms/")]
    write(os.path.join(out, "_redirects"),
          "".join(f"{a}  {b}  301\n" for a, b in redirects))
    vercel = ("  \"trailingSlash\": true,\n  \"redirects\": [\n" + ",\n".join(
        f'    {{ "source": "{a}", "destination": "{b}", "permanent": true }}' for a, b in redirects) + "\n  ],\n"
        '  "headers": [\n    { "source": "/assets/(.*)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] }\n  ]\n}\n')
    # dist/vercel.json applies when Vercel's Root Directory is "dist"; the repo-root copy applies
    # when it's left at the repo root, and points Vercel at the prebuilt dist/ folder.
    write(os.path.join(out, "vercel.json"), "{\n" + vercel)
    write(os.path.join(ROOT, "vercel.json"), "{\n  \"framework\": null,\n  \"installCommand\": \"\",\n"
          "  \"buildCommand\": \"echo dist/ is prebuilt by src/build.py\",\n  \"outputDirectory\": \"dist\",\n" + vercel)
    write(os.path.join(out, ".htaccess"), "ErrorDocument 404 /404.html\nRewriteEngine On\n" + "".join(
        f"RewriteRule ^{a.lstrip('/').replace('.', chr(92) + '.')}$ {b} [R=301,L]\n" for a, b in redirects))
    return out


if __name__ == "__main__":
    for m in ("prod", "preview"):
        print("built", build(m))
