import os
from dotenv import load_dotenv
import resend
from typing import List

# Load relevant template to run this script on.
from templates.versioned_preenroll.sp25.current_freshman import *

# Load environment variables from .env
load_dotenv(".env.private")

resend.api_key = os.environ["RESEND_API_KEY"]

# Global constants across all sessions — please do not change these.
FROM = os.environ["GLOBAL_FROM_NAME"] + " <" + os.environ["GLOBAL_FROM_EMAIL"] + ">"
TO = os.environ["GLOBAL_TO_EMAIL"]


def chunk_list(lst: List[str], chunk_size: int) -> List[List[str]]:
    return [lst[i : i + chunk_size] for i in range(0, len(lst), chunk_size)]


def send_emails(bcc_list: List[str]):
    bcc_chunks = chunk_list(bcc_list, 49)
    total_chunks = len(bcc_chunks)

    # Add option to list all emails
    list_emails = (
        input("Do you want to list all email addresses? (y/N): ").lower().strip()
    )
    if list_emails == "y":
        print("\nList of email addresses:")
        for email in bcc_list:
            print(email)
        print()

    # Add confirmation prompt
    confirm = (
        input(
            f"Do you want to proceed with sending {len(bcc_chunks)} {'email' if len(bcc_chunks) == 1 else 'emails'} to {len(bcc_list)} {'recipient' if len(bcc_list) == 1 else 'recipients'}? (y/N): "
        )
        .lower()
        .strip()
    )

    if confirm != "y":
        print("Email sending cancelled. Goodbye!")
        return
    else:
        print(
            f"Starting email job with {len(bcc_list)} {'recipient' if len(bcc_list) == 1 else 'recipients'} in {total_chunks} batch(es).\n"
        )

    for i, bcc_chunk in enumerate(bcc_chunks, 1):
        params: resend.Emails.SendParams = {
            "from": FROM,
            "to": TO,  # Must always have a to recipient for bcc to work.
            "bcc": bcc_chunk,
            "subject": SUBJECT,
            "html": HTML,
        }

        try:
            resend.Emails.send(params)
            print(f"Batch {i}/{total_chunks} sent successfully!")
        except Exception as e:
            print(f"Batch {i}/{total_chunks} failed with error: {e}")

    print("\nAll email batches sent successfully!")
    print("Email job completed!")


if __name__ == "__main__":
    send_emails(BCC)
