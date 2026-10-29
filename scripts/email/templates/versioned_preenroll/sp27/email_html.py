import sys
import os
from datetime import date
from typing import List
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

# Add the root directory to the system path. The script should be run from the root (`courseplan`) directory.
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..")
    )
)

from scripts.email.templates.versioned_preenroll.sp27.data.pre_enroll_dates import (
    PRE_ENROLL_DATES,
)

# Images live in `public/email/sp27/` and are served from courseplan.io once deployed.
# `preview.py` swaps this out for the local folder so the email can be previewed before deploying.
IMAGE_BASE = "https://courseplan.io/email/sp27"

IMAGES = ["bg.png", "logo.png"]


def missing_images(base: str) -> List[str]:
    """Returns the image URLs under `base` that don't load, so a send can stop before going out broken."""
    missing = []
    for name in IMAGES:
        url = f"{base}/{name}"
        try:
            with urlopen(Request(url, method="HEAD"), timeout=10) as res:
                # The site rewrites unknown paths to index.html with a 200, so check it's really an image.
                if res.status != 200 or not res.headers.get_content_type().startswith(
                    "image/"
                ):
                    missing.append(url)
        except (HTTPError, URLError):
            missing.append(url)
    return missing


TEAL = "#1AA9A5"
FONT = "'DM Sans', Helvetica, Arial, sans-serif"

# Each connector fades from one dot color to the next, matching the Figma timeline.
CONNECTOR_COLORS = [
    ("#105352", "#4F8095"),
    ("#4F8196", "#90C1E4"),
    ("#92C3E6", "rgba(146, 195, 230, 0)"),
]


def ordinal(n: int) -> str:
    if 11 <= n % 100 <= 13:
        return f"{n}th"
    return f"{n}{ {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th') }"


def days_until_first_slot(today: date) -> int:
    return (min(day for _, day in PRE_ENROLL_DATES) - today).days


def countdown_text(today: date) -> str:
    # Counts to the first class's slot, so it reads "starts in", which is true for every class.
    days = days_until_first_slot(today)
    if days <= 0:
        # Later classes may not have started yet, so point them at their date instead.
        return "Pre-Enroll is underway — find your date below!"
    # Under two weeks, weeks are too coarse (13 days would read as "1 week").
    if days < 14:
        return f"Pre-Enroll starts in {days} day{'' if days == 1 else 's'}!"
    weeks = round(days / 7)
    return f"Pre-Enroll starts in {weeks} weeks!"


def intro_text(today: date) -> str:
    if days_until_first_slot(today) <= 0:
        return "Spring 2027 pre-enroll is here"
    return "Spring 2027 pre-enroll is right around the corner"


def timeline_card(label: str, day: date) -> str:
    return f"""
    <tr>
        <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="214" style="width: 214px;">
                <tr>
                    <td align="center" bgcolor="#FFFFFF" style="background-color: #FFFFFF; border-radius: 6px; padding: 11px 8px; font-family: {FONT}; color: #000000;">
                        <div style="font-size: 12px; font-weight: 700; line-height: 17px;">{label}</div>
                        <div style="font-size: 12px; line-height: 17px;">{day.strftime('%B')} {ordinal(day.day)}</div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>"""


def timeline_connector(top: str, bottom: str) -> str:
    # Dot, fading line, small dot. Built from table cells so Outlook keeps the sizes.
    return f"""
    <tr>
        <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="10" height="10" bgcolor="{top}" style="width: 10px; height: 10px; background-color: {top}; border-radius: 5px; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="2" height="41" bgcolor="{top}" style="width: 2px; height: 41px; background-color: {top}; background-image: linear-gradient({top}, {bottom}); font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="6" height="6" style="width: 6px; height: 6px; background-color: {bottom}; border-radius: 3px; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
            </table>
        </td>
    </tr>"""


def timeline() -> str:
    rows = []
    for i, (label, day) in enumerate(PRE_ENROLL_DATES):
        rows.append(timeline_card(label, day))
        if i < len(CONNECTOR_COLORS):
            rows.append(timeline_connector(*CONNECTOR_COLORS[i]))
    return "".join(rows)


# Computed when the template is imported, i.e. on the day it's previewed or sent.
COUNTDOWN = countdown_text(date.today())
INTRO = intro_text(date.today())

SUBJECT = "Spring '27 pre-enroll is coming — start planning today 📚"
HTML = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #E9EEF0;">

<!-- Inbox preview text; hidden in the email itself. -->
<div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
    {COUNTDOWN} Plan your Spring 2027 schedule with CoursePlan before your time slot.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#E9EEF0" style="background-color: #E9EEF0;">
    <tr>
        <td align="center" style="padding: 24px 0;">
            <table role="presentation" width="612" cellpadding="0" cellspacing="0" border="0"
                background="{IMAGE_BASE}/bg.png" bgcolor="#CFEAEA"
                style="width: 100%; max-width: 612px; background-color: #CFEAEA; background-image: url('{IMAGE_BASE}/bg.png'); background-size: cover; background-position: center top; background-repeat: no-repeat;">

                <!-- Logo -->
                <tr>
                    <td align="center" style="padding-top: 18px;">
                        <img src="{IMAGE_BASE}/logo.png" width="62" height="62" alt="CoursePlan"
                            style="display: block; width: 62px; height: 62px; border: 0; font-family: {FONT}; font-size: 10px; color: #3D3D3D;">
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding-top: 4px; font-family: {FONT}; font-size: 11px; font-weight: 700; color: #3D3D3D;">
                        Courseplan
                    </td>
                </tr>

                <!-- Headline -->
                <tr>
                    <td align="center" style="padding-top: 48px; font-family: {FONT}; font-size: 16px; font-weight: 600; color: #3D3D3D;">
                        {COUNTDOWN}
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 6px 16px 0; font-family: {FONT}; font-size: 42px; line-height: 50px; font-weight: 700; color: #1D1D1B;">
                        Start Planning <span style="color: {TEAL}; text-decoration: underline;">Today</span>
                    </td>
                </tr>

                <!-- Body copy -->
                <tr>
                    <td align="center" style="padding: 50px 24px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="392" style="width: 100%; max-width: 392px;">
                            <tr>
                                <td align="center" style="font-family: {FONT}; font-size: 13px; line-height: 17px; color: #000000;">
                                    {INTRO} — and we know you'd rather not be stressing in the Ithaca cold.
                                    <br><br>
                                    Skip the last-minute scramble and plan your perfect schedule with CoursePlan, Cornell's go-to tool for making class planning a breeze.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Registration timeline -->
                <tr>
                    <td align="center" style="padding: 92px 0 18px; font-family: {FONT}; font-size: 14px; font-weight: 600; color: #3D3D3D;">
                        Registration Timeline
                    </td>
                </tr>
                {timeline()}

                <!-- CTA -->
                <tr>
                    <td align="center" style="padding: 54px 24px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="339" style="width: 100%; max-width: 339px;">
                            <tr>
                                <td align="center" bgcolor="{TEAL}" style="background-color: {TEAL}; border-radius: 38px;">
                                    <a href="https://courseplan.io" target="_blank"
                                        style="display: block; padding: 22px 0; font-family: {FONT}; font-size: 24px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 38px;">
                                        Create your Plan
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center" style="padding: 120px 32px 28px; font-family: {FONT}; font-size: 11px; line-height: 17px; color: #105352;">
                        Questions?
                        <a href="mailto:courseplan.io@gmail.com" style="color: #105352; text-decoration: underline;">courseplan.io@gmail.com</a>
                        &nbsp;•&nbsp;
                        <a href="https://www.instagram.com/courseplan.io/" style="color: #105352; text-decoration: underline;">Instagram</a>
                        <br>
                        Don't want these emails? Reply and let us know.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
"""
