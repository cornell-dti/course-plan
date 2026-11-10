"""
Render an email template in browser without sending anything or needing keys.

Run from the root (`courseplan`) directory:
    python3 scripts/email/preview.py
"""

import sys
import tempfile
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.append(str(ROOT))

from scripts.email.templates.versioned_preenroll.sp27.email_html import (
    HTML,
    IMAGE_BASE,
    SUBJECT,
)

# Point images at the local `public/` folder so they show up before being deployed.
local_images = (ROOT / "public" / "email" / "sp27").as_uri()
html = HTML.replace(IMAGE_BASE, local_images)

with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
    f.write(html)

print(f"Subject: {SUBJECT}")
print(f"Preview written to {f.name}")
webbrowser.open(Path(f.name).as_uri())
