import sys
import os

# Add the root directory to the system path. The script should be run from the root (`courseplan`) directory.
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
)

from scripts.email.helpers.firebase_users_loader import USERS


# BCC = [user["email"] for user_list in USERS.values() for user in user_list]
BCC = ["dl979@cornell.edu", "nmp79@cornell.edu"]  # 2025 Spring PMM & PM
# BCC = ["nm549@cornell.edu"] # 2024 Fall and 2025 Spring TPM

print(f"{len(BCC)} users are relevant to this template.\n")
SUBJECT = "Take Note! CoursePlan Just Got Smarter."
HTML = f"""

<div style="font-family: Proxima Nova, sans-serif; margin: 0 auto; background-color: #F7F7F7; font-size: 16px;">
    <div style="text-align: center; padding: 40px 0px;">
        <a href="https://ibb.co/dsg7Ww5R"><img src="https://i.ibb.co/NgS7VdyM/Screenshot-2025-02-13-at-5-12-07-PM.png" alt="CoursePlan Logo" border="0" style="height: 60px; width: 60px;";></a>
    </div>
    <div style="background-color: #FFFFFF; border-radius: 10px; padding: 40px 48px; max-width: 600px; margin: 0 auto;">

        <p style="font-weight: bold;">HEY COURSEPLANNER,</p>

        <h2 style="color: #198F80; text-transform: uppercase; text-align: center; margin-bottom: 5px;">Introducing</h2>
        <h1 style="text-align: center; font-weight: bold; margin-top: 0;">NOTES</h1>

        <p>Picking the right classes just got easier! CoursePlan now lets you add <strong>Notes</strong> under your courses — perfect for reminders like:</p>

        <p>
        ✅ Only take this if [Professor Name] is teaching!<br>
        ✅ Pairs well with [Another Course] for a lighter workload<br>
        ✅ This class fills fast—enroll ASAP!
        </p>

        <h3 style="font-weight: bold;">Add a Note in Seconds 📑</h3>
        <p>Quickly jot down important details under any course in your planner. Just click on a class, select "Add Note," and type away!</p>

        <div style="text-align: center;">
            <a href="https://gifyu.com/image/bblzy"><img src="https://s3.gifyu.com/images/bblzy.gif" alt="creatingNotes1" border="0" style="height:400px; width: 300px; border-radius: 20px"/></a>
            <div style="position: relative; height: 0;"><iframe id="js_video_iframe" src="https://jumpshare.com/embed/hjuKgADurbT4UzqAZNFa" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; height: 50px; width: 50px;"></iframe></div>

        <p style="color: #198F80; text-align: center; font-size: 14px;">🔹Pro tip: Use notes to flag prerequisites or warnings from upperclassmen!</p>

        <h3 style="font-weight: bold;">Customize Your Notes 🎨</h3>
        <p>Make Notes work for you! Edit them anytime by clicking on the note field.</p>

        <div style="text-align: center;">
        <a href="https://ibb.co/f5TcbRw"><img src="https://i.ibb.co/f5TcbRw/Untitled-design.png" alt="Editing Node" border="0" style="height: 240px; width: 300px; border-radius: 0" /></a>
        <h3 style="font-weight: bold;">Delete When You're Done ❌</h3>
        <p>Changing plans? Removing a note is as easy as clicking the "X" next to it. Keep your CoursePlan clean and up to date!</p>
         <div style="text-align: center; margin: 20px 0;">
            <a href="https://gifyu.com/image/bblLW"><img src="https://s3.gifyu.com/images/bblLW.gif" alt="creatingNotes2" border="0" style="height: 285px; width: 280px; border-radius:20px" /></a>
        </div>
        <p>We're always taking notes 🗒️ on how to improve CoursePlan for you! Got feedback? Questions? Suggestions? Hit us up at <a href="mailto:courseplan.io@gmail.com" style="color: #1AA9A5; text-decoration: none;">courseplan.io@gmail.com</a>.</p>

        <p>We’re also working on some exciting updates, so follow us on <a href="https://www.instagram.com/courseplan.io/" style="color: #1AA9A5; text-decoration: none;">Instagram</a> for the latest! Expect to hear from us every so often—right in your inbox.</p>
        <p>See you soon,<br>
        Your friends at CoursePlan DTI ❤️</p>

        <p style="text-align: center;">
            Not a user yet? <a href="https://courseplan.io" style="color: #1AA9A5; text-decoration: underline;">Get started here</a><br>
            Don't want to graduate? <a href="https://courseplan.io" style="color: #1AA9A5; text-decoration: underline;">Unsubscribe</a>
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
            <a href="https://courseplan.io" style="color: #1AA9A5; text-decoration: underline;"">CoursePlan</a>
        </p>
    </div>
</div>

"""
