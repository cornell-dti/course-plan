import firebase_admin
from firebase_admin import credentials, firestore
from collections import defaultdict
from typing import Dict, List, Tuple

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


def get_all_user_names() -> Dict[str, Tuple[str, str, str]]:
    print("Fetching all user names from Firebase...", end="\n\n")
    user_names = {}
    docs = db.collection("user-name").get()
    for doc in docs:
        data = doc.to_dict()
        user_names[doc.id] = (
            data.get("firstName", None),
            data.get("middleName", None),
            data.get("lastName", None),
        )
    return user_names


def get_users() -> Dict[Tuple[str, str], List[Dict]]:
    print("Fetching all user data from Firebase...")
    user_names = get_all_user_names()
    users = db.collection("user-onboarding-data").get()
    user_map = defaultdict(list)

    for user in users:
        user_data = user.to_dict()
        email = user.id
        first_name, middle_name, last_name = user_names.get(
            email, (None, None, None)
        )  # NOTE: may cause type errors if we don't have a name for this user and try
        # to send them an email regardless. (Deliberate decision.)

        # Deleted accounts or something? Not sure to do with these people.
        if first_name is None and middle_name is None and last_name is None:
            print(f"User {email} not found in user-name collection!")

        colleges = [
            college.get("acronym", "") for college in user_data.get("colleges", [])
        ]
        grad_programs = [
            program.get("acronym", "") for program in user_data.get("gradPrograms", [])
        ]
        entrance_sem = user_data.get("entranceSem", None)
        entrance_year = user_data.get("entranceYear", None)
        majors = [major.get("acronym", "") for major in user_data.get("majors", [])]
        minors = [minor.get("acronym", "") for minor in user_data.get("minors", [])]

        key = (entrance_sem, entrance_year)
        user_map[key].append(
            {
                "email": email,
                "first_name": first_name,
                "middle_name": middle_name,
                "last_name": last_name,
                "colleges": colleges,
                "grad_programs": grad_programs,
                "entrance_semester": entrance_sem,
                "entrance_year": entrance_year,
                "majors": majors,
                "minors": minors,
            }
        )

    print(f"\nFetched {len(user_map)} users.")

    return dict(user_map)


USERS = get_users()
