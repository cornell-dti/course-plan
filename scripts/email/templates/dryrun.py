BCC = ["eyy26@cornell.edu"]
# SUBJECT = "Are you signed up for CoursePlan yet 🤔 "
# HTML = (
#     (
#         "Hi Hannah, <br><br>We're just checking in...<br><br>Our patience is running short ⏰.<br><br><strong>Soon it won't just be emails that we send.</strong><br><br>– the CP unit"
#     ),
# )

SUBJECT = "Pre-Enroll Reminder from CoursePlan for the Spring '26 Semester!"
with open("scripts/email/templates/versioned_preenroll/sp26/preview.html", "r", encoding="utf-8") as file:
    HTML = file.read()