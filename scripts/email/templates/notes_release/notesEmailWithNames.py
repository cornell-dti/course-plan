import sys
import os

# Add the root directory to the system path. The script should be run from the root (`courseplan`) directory.
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
)

from scripts.email.helpers.firebase_users_loader import USERS

USER_DATA = [
    (user["email"], user["first_name"])
    for user_list in USERS.values()
    for user in user_list
]
# BCC = [user["email"] for user_list in USERS.values() for user in user_list]
# BCC = ["dl979@cornell.edu", "nmp79@cornell.edu"]
BCC = ["nidhi.mylavarapu@gmail.com"]

print(f"{len(BCC)} users are relevant to this template.\n")
SUBJECT = "Make your Schedule Swoon Worthy - Hello from CoursePlan💙"
for email, first_name in USER_DATA:
    greeting_name = (
        first_name if first_name else "there"
    )  # Fallback to "Hi there!" if no name

    HTML = f"""
    <div style="font-family: Proxima Nova, sans-serif; margin: 0 auto; background-color: #F7F7F7; font-size: 16px;">
        <div style="text-align: center; padding: 40px 0px;">
            <a href="https://ibb.co/dsg7Ww5R"><img src="https://i.ibb.co/NgS7VdyM/Screenshot-2025-02-13-at-5-12-07-PM.png" 
                alt="CoursePlan Logo" border="0" style="height: 60px; width: 60px;"></a>
        </div>
        <div style="background-color: #FFFFFF; border-radius: 10px; padding: 40px 48px; margin-bottom: 20px; max-width: 600px; margin: 0 auto;">

            <p style="margin: 0; font-size: 16px;"><strong>💘 Hi {greeting_name}, Welcome Back, Big Red! 💘</strong></p>
            <p style="line-height: 1.5; font-size: 16px;">Roses are red, violets are blue, Spring semester is here, and we’re excited for you! 🌹✨ 
            Whether you're falling in love with new classes or just happy to reunite with campus, CoursePlan is here to help you stay on track. </p>

            <p style="line-height: 1.5; font-size: 16px;"> 💡 Need to organize your schedule or check your requirements? We’ve got you covered—because nothing says true love like a well-planned semester. 💕 </p>

            <h3 style="font-size: 24px; text-align: center; margin-bottom: 5px;">Love is in the Air… and So is Course Planning!</h3>

            <div style="padding: 20px;">
                <img src="https://user-images.githubusercontent.com/55263191/117371152-669f2d00-ae95-11eb-9b92-3d18a0505f57.png"
                    alt="Schedule Planning" style="width: 100%; height: auto; margin-bottom: -4px;">
                <p style="color: #3D3D3D; text-align: center; font-size: 15px; width: 50%; margin: 0 auto 16px;">Your dream schedule is just one click away!</p>
                <div style="text-align: center;">
                    <a href="https://courseplan.io" target="_blank"
                        style="background-color: #508197; color: white; text-decoration: none; padding: 10px 33px; border-radius: 5px; display: inline-block; font-family: Albert Sans, Proxima Nova, sans-serif; font-size: 15px; letter-spacing: 0.05em;">Start Planning</a>
                </div>
            </div>

            <p style="line-height: 1.5; font-size: 16px;">Wishing you a semester full of success, learning, and love at first plan as you map out the perfect schedule! Happy Spring 2025! 🎉</p>

            <p style="line-height: 1.5; font-size: 16px;">Got a question, comment, or just wanna share some CoursePlan love? 💌 Hit us up at 
                <a href="mailto:courseplan.io@gmail.com" style="color: #1AA9A5; text-decoration: none;" target="_blank">courseplan.io@gmail.com</a> 
                — we’d love to hear from you!! P.S. We’re working on some sweet updates just for you. 🍫 Follow us on 
                <a href="https://www.instagram.com/courseplan.io/" style="color: #1AA9A5; text-decoration: none;" target="_blank">Instagram</a> 
                to stay in the loop, and keep an eye on your inbox for little love notes (aka helpful tips & updates) from us!</p>

            <p style="line-height: 1.5; font-size: 16px;">
                Catch you soon!<br>
                Your Valentine - CoursePlan DTI 💕 </p>
        </div>
    </div>
    """

    # print(f"Sending email to {email} with personalized greeting: Hi {greeting_name}!")
