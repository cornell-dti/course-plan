import os
from dotenv import load_dotenv
import resend
from typing import List
import time

# IMPORTANT: Load relevant template to run this script on.
from templates.dryrun import *

# Load environment variables from .env
load_dotenv(".env.private")

resend.api_key = os.environ["RESEND_API_KEY"]

# Global constants across all sessions — please do not change these.
FROM = os.environ["GLOBAL_FROM_NAME"] + " <" + os.environ["GLOBAL_FROM_EMAIL"] + ">"
TO = os.environ["GLOBAL_TO_EMAIL"]


def chunk_list(lst: List[str], chunk_size: int) -> List[List[str]]:
    return [lst[i : i + chunk_size] for i in range(0, len(lst), chunk_size)]


def send_emails(bcc_list: List[str], delay_seconds: float = 3.0):
    '''
    Send emails in batches with optional delay between batches.
    '''
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
            f"Do you want to proceed with sending {len(bcc_chunks)} {'chunk' if len(bcc_chunks) == 1 else 'chunks'} of {'email' if len(bcc_chunks) == 1 else 'emails'} to {len(bcc_list)} {'recipient' if len(bcc_list) == 1 else 'recipients'}? (y/N): "
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
        
        # Add delay between batches to respect rate limits
        if i < total_chunks:
            time.sleep(delay_seconds)

    print("\nAll email batches sent successfully!")
    print("Email job completed!")

def retry_failed_batches(bcc_list: List[str], failed_batch_numbers: List[int], delay_seconds: float = 3.0):
    """
    Retry sending emails for specific failed batches.
    
    Args:
        bcc_list: The complete list of email addresses
        failed_batch_numbers: List of batch numbers that failed (1-indexed)
        delay_seconds: Delay between batches in seconds (default: 3.0)
    """
    bcc_chunks = chunk_list(bcc_list, 49)
    total_chunks = len(bcc_chunks)
    
    # Filter to only failed batches
    failed_chunks = [(num, bcc_chunks[num - 1]) for num in failed_batch_numbers if num <= total_chunks]
    
    if not failed_chunks:
        print("No valid failed batch numbers provided.")
        return
    
    # Add confirmation prompt
    confirm = (
        input(
            f"Do you want to proceed with re-sending {len(failed_chunks)} {'chunk' if len(failed_chunks) == 1 else 'chunks'} of {'email' if len(failed_chunks) == 1 else 'emails'} (y/N): "
        )
        .lower()
        .strip()
    )

    if confirm != "y":
        print("Email re-sending cancelled. Goodbye!")
        return
    else:
        print(
            f"Restarting email job with {len(failed_chunks)} {'chunk' if len(failed_chunks) == 1 else 'chunks'} of {'email' if len(failed_chunks) == 1 else 'emails'}.\n"
        )
    
    print(f"\nRetrying {len(failed_chunks)} failed batch(es)...\n")
    
    for batch_num, bcc_chunk in failed_chunks:
        params: resend.Emails.SendParams = {
            "from": FROM,
            "to": TO,
            "bcc": bcc_chunk,
            "subject": SUBJECT,
            "html": HTML,
        }

        try:
            resend.Emails.send(params)
            print(f"Batch {batch_num}/{total_chunks} sent successfully!")
        except Exception as e:
            print(f"Batch {batch_num}/{total_chunks} failed with error: {e}")
        
        # Add delay between batches
        if batch_num != failed_batch_numbers[-1]:  # Don't wait after the last batch
            time.sleep(delay_seconds)
    
    print("\nRetry completed!")


if __name__ == "__main__":
    # UNCOMMENT THESE LINE IF SOME BATCHES WERE UNSUCCESSFUL
    # FAILED_BATCHES = [
    #     3, 4, 5, 6, 9, 10, 11, 12, 15, 16, 17, 18, 21, 22, 23, 24, 
    #     27, 28, 29, 30, 33, 34, 35, 38, 39, 40, 41, 44, 45, 46, 47, 
    #     50, 51, 52, 53, 54, 57, 58, 59, 60, 63, 64, 65, 66, 69, 70, 
    #     71, 72, 73, 76, 77
    # ]
    # To retry only failed batches:
    # retry_failed_batches(BCC, FAILED_BATCHES, delay_seconds=3.0)
    
    # Default: To send all emails
    send_emails(BCC, delay_seconds=3.0)
