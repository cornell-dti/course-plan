import os
from dotenv import load_dotenv
import resend
from typing import List

# Load relevant template to run this script on.
from templates.dryrun import *

# Load environment variables from .env
load_dotenv(".env")

resend.api_key = os.environ["RESEND_API_KEY"]

# Global constants across all sessions — please do not change these.
FROM = os.environ["GLOBAL_FROM_NAME"] + " <" + os.environ["GLOBAL_FROM_EMAIL"] + ">"
TO = os.environ["GLOBAL_TO_EMAIL"]


def chunk_list(lst: List[str], chunk_size: int) -> List[List[str]]:
    return [lst[i : i + chunk_size] for i in range(0, len(lst), chunk_size)]


def send_emails(bcc_list: List[str]):
    bcc_chunks = chunk_list(bcc_list, 50)
    total_chunks = len(bcc_chunks)

    print(
        f"Starting email job with {len(bcc_list)} recipients in {total_chunks} batch(es)."
    )

    for i, bcc_chunk in enumerate(bcc_chunks, 1):
        params: resend.Emails.SendParams = {
            "from": FROM,
            "to": TO,  # Must always have a to recipient for bcc to work.
            "bcc": bcc_chunk,
            "subject": SUBJECT,
            "html": HTML,
        }

        email = resend.Emails.send(params)
        print(f"Batch {i}/{total_chunks} sent successfully!")

    print("All email batches sent successfully!")


if __name__ == "__main__":
    send_emails(BCC)
    print("Email job completed!")
