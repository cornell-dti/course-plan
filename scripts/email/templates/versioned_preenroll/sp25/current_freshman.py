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
        (user["entrance_year"] == "2024" and user["entrance_semester"] == "Fall")
        or (user["entrance_year"] == "2025" and user["entrance_semester"] == "Spring")
        # handle VTMED students
        # or (
        #     (
        #         user["entrance_year"] == "2029"
        #         and user["entrance_semester"] == "Spring"
        #         and "VTMED" in user["majors"]
        #     )
        #     or (
        #         user["entrance_year"] == "2028"
        #         and user["entrance_semester"] == "Fall"
        #         and "VTMED" in user["majors"]
        #     )
        # )
    )
]

print(f"{len(BCC)} users are relevant to this template.\n")

# Get pre-enroll dates for freshmen and first-year vet students
freshman_dates = PRE_ENROLL_DATES["2028", "2029-VTMED"]
start_date = freshman_dates["start_date"]
end_date = freshman_dates["end_date"]

SUBJECT = "Pre-Enroll Reminder from CoursePlan for the Spring '25 Semester!"
HTML = f"""
<div style="font-family: Proxima Nova, sans-serif; margin: 0 auto; background-color: #F7F7F7; font-size: 16px;">
    <div style="text-align: center; padding: 40px 0px;">
        <img src="https://i.postimg.cc/3RFF8VpK/logo.png"
            alt="Cornell CoursePlan Logo" style="height: 50px;">
    </div>
    <div
        style="background-color: #FFFFFF; border-radius: 10px; padding: 40px 48px; margin-bottom: 20px; max-width: 600px; margin: 0 auto;">

        <div style="padding: 20px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 16px;"><strong>Hey CoursePlanner,</strong></p>
            <p style="line-height: 1.5; font-size: 16px;">🥳 Happy pre-enroll 🥳 Your pre enroll time slot is coming up
                on
                {start_date} – {end_date}. If you haven't met <strong>CoursePlan</strong> yet, it's the go-to platform for
                requirement tracking & schedule building.</p>
        </div>

        <h2
            style="color: #1AA9A5; font-size: medium; text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">
            INTRODUCING</h2>
        <h3 style="font-size: 24px; text-align: center; margin-bottom: 5px;">Schedule Generator &
            Multiple
            Plans</h3>

        <div style="padding: 20px;">
            <img src="https://i.postimg.cc/pVRGnYs9/auto-generatedsched.png"
                alt="Schedule Generator" style="width: 100%; height: auto; margin-bottom: -4px;">
            <p style="color: #3D3D3D; text-align: center; font-size: 15px; width: 50%; margin: 0 auto 16px;">Select
                the classes&nbsp;<span style="opacity: 50%;">you're
                    interested in & get auto-generated</span>&nbsp;schedule suggestions.</p>
            <div style="text-align: center;">
                <a href="https://courseplan.io" target="_blank"
                    style="background-color: #508197; color: white; text-decoration: none; padding: 10px 33px; border-radius: 5px; display: inline-block; font-family: Albert Sans, Proxima Nova, sans-serif; font-size: 15px; letter-spacing: 0.05em;">Take
                    a look</a>
            </div>
        </div>

        <div style="padding: 20px; margin-bottom: 44px;">
            <img src="https://i.postimg.cc/LHgbdsqs/multipleversion.png"
                alt="Multiple Plans" style="width: 100%; height: auto; margin-bottom: -4px;">
            <p style="color: #3D3D3D; text-align: center; font-size: 15px; width: 50%; margin: 0 auto 16px;">Create
                multiple versions&nbsp;<span style="opacity: 50%;">of
                    your 4 year plan to find the best
                    one suited for you.</span></p>
            <div style="text-align: center;">
                <a href="https://courseplan.io" target="_blank"
                    style="background-color: #508197; color: white; text-decoration: none; padding: 10px 40px; border-radius: 5px; display: inline-block; font-family: Albert Sans, Proxima Nova, sans-serif; font-size: 15px; letter-spacing: 0.05em;">Try
                    it out</a>
            </div>
        </div>

        <p style="line-height: 1.5; font-size: 16px;">Got a Question? Comment? Concern? Let us know how we can make
            CoursePlan the best at <a href="mailto:courseplan.io@gmail.com"
                style="color: #1AA9A5; text-decoration: none;" target="_blank">courseplan.io@gmail.com</a>! And... we're
            cooking up some cool updates for y'all, so follow
            our <a href="https://www.instagram.com/courseplan.io/" style="color: #1AA9A5; text-decoration: none;"
                target="_blank">Instagram</a> for the latest. Look forward to hearing from us every so often — right in
            your inbox!</p>

        <p style="line-height: 1.5; font-size: 16px;">
            See you soon,<br>
            Your friends at CoursePlan DTI &lt;3 </p>

        <p style="font-size: 16px;">PS: have you heard of our giveaway? 👀</p>

        <img src="https://i.postimg.cc/yYYvd1v2/cp-square.png"
            alt="Cornell CoursePlan Icon" style="height: 32px;">

        <p style="line-height: 1.5; margin-top: 37.5px; font-size: 16px;">
            Not a user yet? <a href="https://courseplan.io" target="_blank"
                style="color: #1AA9A5; text-decoration: underline;">Get started here</a><br>
            Don't want to graduate? <a href="https://courseplan.io" target="_blank"
                style="color: #1AA9A5; text-decoration: underline;">Unsubscribe on
                your profile tab</a>
        </p>
    </div>
</div>

<div
    style="background-color: #105351; color: white; padding: 15px 35px; font-size: 16px; font-family: Proxima Nova, sans-serif;">
    <div style="display: flex; margin: 0 auto;">
        <p style="margin-left: 0; margin-right: auto;">Schedule Smarter. Plan Ahead.</p>
        <p style="margin-left: auto; margin-right: 0;">
            <a href="https://www.instagram.com/courseplan.io/" style="color: #1AA9A5; text-decoration: underline;">Instagram</a>
            <span style="margin: 0 5px;">•</span>
            <a href="https://courseplan.io" style="color: #1AA9A5; text-decoration: underline;"">Courseplan</a>
        </p>
    </div>
</div>
"""
