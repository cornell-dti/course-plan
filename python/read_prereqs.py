import requests
import json
from typing import List

prefix = "https://classes.cornell.edu/api/2.0"


def get_semesters():
    """
    Returns all valid semesters from the roster
    """
    json_str = requests.get(f"{prefix}/config/rosters.json").text
    json_dict = json.loads(json_str)
    semesters = json_dict["data"]["rosters"]
    return [semester["slugs"] for semester in semesters]


def _get_subjects(semester: str):
    """
    Gets subjects based on semester (like MATH or PE)
    """
    json_str = requests.get(f"{prefix}/config/subjects.json?roster={semester}").text
    json_dict = json.loads(json_str)
    subjects = json_dict["data"]["subjects"]
    return [subject["value"] for subject in subjects]


def _get_classes_by_subject(semester: str, subject: str):
    """
    Gets courses based on the subject and semester (like MATH 2940 or PE 1510)
    """
    json_str = requests.get(
        f"{prefix}/search/classes.json?roster={semester}&subject={subject}"
    ).text
    json_dict = json.loads(json_str)
    courses = json_dict["data"]["classes"]
    return courses


def _get_req_str_dict_from_courses(courses: List[str]):
    """
    Gets the prerequisite/corequisite string from a list of courses and puts it
    in a dictionary with keys being the course name + ID and values being the
    string.

    e.g.
    {
        'MATH 2940': 'MATH 1920 or equivalent'
    }
    """
    req_strs = {}
    for course in courses:
        if (
            not course["catalogPrereqCoreq"] == ""
            and course["catalogPrereqCoreq"] is not None
        ):
            req_strs[f"{course['subject']} {course['catalogNbr']}"] = course[
                "catalogPrereqCoreq"
            ]
    return req_strs


def get_all_classes_req_strs_from_semester(semester):
    """
    Gets all prerequisite/corequisite string and puts it into a dictionary with
    keys being the course name + ID and values being the string given just the
    semester.
    """
    all_courses = []
    subjects = _get_subjects(semester)
    for subject in subjects:
        all_courses += _get_classes_by_subject(semester, subject)
    req_strs = _get_req_str_dict_from_courses(all_courses)
    return req_strs
