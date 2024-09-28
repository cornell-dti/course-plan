import sys
import os

# Add the root directory to the system path. The script should be run from the root (`courseplan`) directory.
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..")
    )
)

from scripts.email.helpers.firebase_users_loader import USERS
from scripts.email.templates.versioned_preenroll.sp25.data.pre_enroll_dates import (
    PRE_ENROLL_DATES,
)

BCC = [
    user["email"]
    for users in USERS.values()
    for user in users
    if (
        (user["graduation_year"] == "2028" and user["graduation_semester"] == "Spring")
        or (user["graduation_year"] == "2027" and user["graduation_semester"] == "Fall")
        # handle VTMED students
        or (
            (
                user["graduation_year"] == "2029"
                and user["graduation_semester"] == "Spring"
                and "VTMED" in user["majors"]
            )
            or (
                user["graduation_year"] == "2028"
                and user["graduation_semester"] == "Fall"
                and "VTMED" in user["majors"]
            )
        )
    )
]

print(f"{len(BCC)} users are relevant to this template.\n")

# Get pre-enroll dates for freshmen and first-year vet students
freshman_dates = PRE_ENROLL_DATES["2028", "2029-VTMED"]
start_date = freshman_dates["start_date"]
end_date = freshman_dates["end_date"]

SUBJECT = "Pre-Enroll Reminder from CoursePlan for the Fall 2025 semester!"
HTML = f"""
    <div>
        <h1>Cornell CoursePlan</h1>

        <p>HEY [Y/N],</p>

        <p>🥳 Happy pre-enroll 🥳 Your pre enroll time slot is coming up on {start_date} – {end_date}. If you haven't met CoursePlan yet, it's the go-to platform for requirement tracking & schedule building.</p>

        <h2>INTRODUCING</h2>
        <h3>Schedule Generator & Multiple Plans</h3>

        <p>Say hello to your generated schedule!</p>

        <p>Select the classes you're interested in & get auto-generated schedule suggestions.</p>

        <button>Take a look</button>

        <p>Create multiple versions of your 4 year plan to find the best one suited for you.</p>

        <button>Try it out</button>

        <p>Got a Question? Comment? Concern? Let us know how we can make CoursePlan the best at courseplan.io@gmail.com! And... we're cooking up some cool updates for y'all, so follow our instagram for the latest. Look forward to hearing from us every so often- right in your inbox!</p>

        <p>See you soon,<br>
        Your friends at CoursePlan DTI <3</p>

        <p>PS: have you heard of our giveaway? **</p>

        <p>Schedule smarter. Plan Ahead.</p>

        <p>Not a user yet? Get started here.<br>
        Don't want to graduate? Unsubscribe</p>

        <footer>
            <p>Schedule Smarter. Plan Ahead.</p>
            <p>Instagram : Courseplan</p>
        </footer>
    </div>
    """
