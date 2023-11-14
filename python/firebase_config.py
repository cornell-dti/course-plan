import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

SERVICE_ACCOUNT_PROD = "serviceAccountProd.json"
SERVICE_ACCOUNT_DEV = "serviceAccount.json"
DATABASE_URL_PROD = "https://cornell-courseplan.firebaseio.com"
DATABASE_URL_DEV = "https://cornelldti-courseplan-dev.firebaseio.com"


def get_database(service_account: dict, databaseURL: str, app_name=None):
    cred = credentials.Certificate(service_account)
    if app_name is None:
        app = firebase_admin.initialize_app(
            credential=cred, options={"databaseURL": databaseURL}
        )
    else:
        app = firebase_admin.initialize_app(
            credential=cred, options={"databaseURL": databaseURL}, name=app_name
        )
    return firestore.client(app)


is_prod = os.environ.get("PROD") == "true"
service_account_filename = SERVICE_ACCOUNT_PROD if is_prod else SERVICE_ACCOUNT_DEV
if os.environ.get("SERVICE_ACCOUNT") is not None:
    service_account_unparsed = os.environ.get("SERVICE_ACCOUNT")
else:
    with open(os.path.join(os.getcwd(), "..", service_account_filename)) as f:
        service_account_unparsed = f.read()
service_account = json.loads(service_account_unparsed)
databaseURL = DATABASE_URL_PROD if is_prod else DATABASE_URL_DEV
db = get_database(service_account, databaseURL)

user_collections = {
    "name": "user-name",
    "semesters": "user-semesters",
    "toggleable": "user-toggleable-requirement-choices",
    "overridden": "user-overridden-fulfillment-choices",
    "colors": "user-subject-colors",
    "unique": "user-unique-incrementer",
    "onboarding": "user-onboarding-data",
}

user_collection_names = user_collections.values()

username_collection = db.collection(user_collections["name"])
semesters_collection = db.collection(user_collections["semesters"])
toggleable_requirement_choices_collection = db.collection(
    user_collections["toggleable"]
)
overridden_fulfillment_choices_collection = db.collection(
    user_collections["overridden"]
)
subject_colors_collection = db.collection(user_collections["colors"])
unique_incrementer_collection = db.collection(user_collections["unique"])
onboarding_data_collection = db.collection(user_collections["onboarding"])
track_users_collection = db.collection("track-users")
courses_collection = db.collection("courses")
available_rosters_for_course_collection = db.collection("available-rosters-for-course")
crse_id_to_catalog_nbr_collection = db.collection("crseid-to-catalognbr")
