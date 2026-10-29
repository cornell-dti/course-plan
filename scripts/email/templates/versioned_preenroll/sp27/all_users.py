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
    HTML,
    IMAGE_BASE,
    missing_images,
)

# Don't let a real send go out with broken images (e.g. before `public/email/sp27` is released).
# Checked before loading users so an early run fails fast without reading all of Firestore.
missing = missing_images(IMAGE_BASE)
if missing:
    sys.exit(
        "These images aren't live yet, so the email would show up broken:\n  "
        + "\n  ".join(missing)
        + "\nDeploy to production first, then try again."
    )

from scripts.email.helpers.firebase_users_loader import USERS

# Undergrads who will still be enrolled in Spring 2027: seniors entered Fall 2023, freshmen Fall 2026.
# Spring entrants count from Spring 2024 (Spring 2023 entrants graduate Dec 2026).
# The email lists every class's date, so one send covers all of them.
UNDERGRAD_ENTRANCE_TERMS = {("Fall", str(year)) for year in range(2023, 2027)} | {
    ("Spring", str(year)) for year in range(2024, 2027)
}

BCC = sorted(
    {
        user["email"]
        for users in USERS.values()
        for user in users
        if user["email"]
        and not user["grad_programs"]
        and (user["entrance_semester"], user["entrance_year"])
        in UNDERGRAD_ENTRANCE_TERMS
    }
)

print(f"{len(BCC)} users are relevant to this template.\n")
