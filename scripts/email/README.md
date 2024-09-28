# CoursePlan Email System

Welcome to the CoursePlan email-sending system. This folder is the home for all logic and templates related to the emails that we send to users, such as onboarding, reminders, notifications about pre-enrollment, etc.

## Infrastructure

This system is built on top of [Resend](https://resend.com)'s email API. We chose Resend over a Google-Cloud based OAuth solution like Nodemailer (used by IDOL) for the following reasons:

1. (**Main reason**): capable of handling high email volumes; Gmail automatically limits the number of emails sent per day and we would go way over that.
2. Improved deliverability rates.
3. Simplified API for sending.

Then in comparison to other email services like Sendgrid, Resend stood out for its quality developer documentation and YC backing.

## Getting Started

1. Install dependencies in the `scripts/email` directory:
   ```bash
   python3 -m pip install -r requirements.txt
   ```

2. Set up environment variables in `.env.private` **in the root directory of the project (`courseplan`)**:
   ```
   RESEND_API_KEY=your_resend_api_key  # contact Simon or your TPM for access
   GLOBAL_FROM_NAME=CoursePlan  # what the name of the sender will be
   GLOBAL_FROM_EMAIL=noreply@courseplan.io  # what the email of the sender will be (once DNS records for courseplan.io are configured)
   GLOBAL_TO_EMAIL=dummy@courseplan.io  # a dummy email address to ensure bcc works
   ```
   **Never commit this file!** (Should already be in `.gitignore`.)

3. Create a new template in `scripts/email/templates/` or use the existing `dryrun.py` as a test example with your own email.

4. Update the import in `execute_template.py` to import the template you created in the previous step. As an example, if you created a file called `new_course_reminder.py` in the templates folder, you would update the import in `execute_template.py` to `from .templates.new_course_reminder import *`. For details on how to create a template, see two sections from now.

5. `cd` upwards into the root directory and run the script:
   ```bash
   python3 scripts/email/execute_template.py
   ```

**Important**: Please revert your import change to `execute_template.py` before pushing any changes. By always sticking with `dryrun.py` as the base template, we can avoid accidentally sending emails to thousands of users (surefire way to worsen your chances at getting an A/A+ for the semester 😅).

## How It Works

1. The script loads environment variables and the specified email template.
2. It chunks the BCC list into groups of 49 recipients to make best use of our 100-email-per-day free tier. (50 is the max number of recipients allowed in a single Resend API call, and this is shared across `to` and `bcc` recipients.)
3. Emails are sent in batches, with progress updates printed to the console.

## Creating Templates

1. Create a new Python file in `scripts/email/templates/`.
2. Define `BCC`, `SUBJECT`, and `HTML` variables.
    - `BCC` should be a list of emails to send to.
    - `SUBJECT` is the subject of the email.
    - `HTML` is the body of the email.
3. **Test your template** by running `python3 scripts/email/execute_template.py` with a simplified BCC list before sending to a large audience.

A couple notes:
- You can refer to existing templates for best practices and to see how to e.g. have the `BCC` list be dynamically generated from our Firebase users.
- **Important**: Ensure all HTML styling is inline as we unfortunately cannot use external CSS directives.

## Fetching Users from Firebase

We use Firebase to store user data and retrieve it for our email templates. The process is handled by the `firebase_users_loader.py` helper script under `scripts/email/helpers/`.

1. The script connects to Firebase using a service account key, stored in the root directory of the project as `serviceAccountKey.json`.
3. It retrieves user data from the `user-onboarding-data` collection.
2. Then, it fetches all user names from the `user-name` collection.
4. The data is processed and organized into a dictionary, with keys being tuples of (graduation_semester, graduation_year).
5. Each user's data includes email, name, colleges, grad programs, majors, minors, and graduation information.

The `USERS` variable in `firebase_users_loader.py` contains this processed data and is imported by individual email templates.

### Using Firebase Data in Templates

Email templates, such as `current_freshman.py`, import the `USERS` data and filter it based on specific criteria. For example:

```python
from scripts.email.templates.helpers.firebase_users_loader import USERS

BCC = [
    user["email"]
    for users in USERS.values()
    for user in users
    if (
        (user["graduation_year"] == "2028" and user["graduation_semester"] == "Spring")
        or (user["graduation_year"] == "2027" and user["graduation_semester"] == "Fall")
    )
]
```

This code filters the `USERS` data to create a `BCC` list of email addresses for current freshmen (in FA24) based on their expected graduation year and semester.

By using this approach, we can easily create targeted email lists for different groups of students without manually maintaining separate lists.

## Further Notes

- You **must** run the script from the root directory of the project.
- Currently using `courseplan.simonilincev.com` for DNS; should be updated to `courseplan.io` soon. This can be done on the Resend dashboard under "Domains" on the sidebar. 4 DNS records need to be set up (configure `_dmarc` as well even though it is optional).
- If you want to have emails land in more than 4,900 inboxes per day, you will need to stagger the emails over several days. Note that these 4,900 inboxes are already "batched" into 100 emails each with 49 bcc recipients.
- A dummy "to" recipient is required when using BCC for technical reasons. (This does not count towards the 49 bcc recipients.)
