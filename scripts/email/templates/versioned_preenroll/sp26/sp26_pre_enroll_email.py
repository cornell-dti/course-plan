import sys
import os

# Add the root directory to the system path. The script should be run from the root (`courseplan`) directory.
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..")
    )
)

from scripts.email.helpers.firebase_users_loader import USERS
# Juniors start date is 2023 Fall or 2024 Spring
# Sophomores start date is 2024 Fall or 2025 Spring
# Freshmen start date is 2025 Fall or 2026 Spring
BCC = [
    user["email"]
    for users in USERS.values()
    for user in users
    if (
        (user["entrance_year"] == "2025" and user["entrance_semester"] == "Fall")
        or (user["entrance_year"] == "2026" and user["entrance_semester"] == "Spring")
        
        or
        
        (user["entrance_year"] == "2024" and user["entrance_semester"] == "Fall")
        or (user["entrance_year"] == "2025" and user["entrance_semester"] == "Spring")
        
        or
        
        (user["entrance_year"] == "2023" and user["entrance_semester"] == "Fall")
        or (user["entrance_year"] == "2024" and user["entrance_semester"] == "Spring")
       
    )
]

print(f"{len(BCC)} users are relevant to this template.\n")

# Since no user data is used in the email, can directly read the html file 
SUBJECT = "Pre-Enroll Reminder from CoursePlan for the Spring '26 Semester!"
with open("scripts/email/templates/versioned_preenroll/sp26/preview.html", "r", encoding="utf-8") as file:
    HTML = file.read()