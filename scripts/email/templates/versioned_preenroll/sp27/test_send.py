import sys
import os

# Add the root directory to the system path. The script should be run from the root (`courseplan`) directory.
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..")
    )
)

from scripts.email.templates.versioned_preenroll.sp27.email_html import (
    SUBJECT,
    HTML as _HTML,
    IMAGE_BASE,
    missing_images,
)

# Sends the sp27 email to just these addresses. No Firebase key needed.
# Add your own email locally; don't commit it.
BCC = []

# Images aren't on courseplan.io until the next production release. To see them in a test
# send, paste the PR preview URL here, e.g. "https://cornelldti-courseplan-dev--pr-1031-abc123.web.app".
PREVIEW_SITE = None

image_base = PREVIEW_SITE.rstrip("/") + "/email/sp27" if PREVIEW_SITE else IMAGE_BASE
HTML = _HTML.replace(IMAGE_BASE, image_base)

missing = missing_images(image_base)
if missing:
    # Only a warning: sending without images is a useful test of the fallback layout.
    print(
        "Note, these images don't load, so this test will show the no-image fallback:\n  "
        + "\n  ".join(missing)
        + "\n"
    )
