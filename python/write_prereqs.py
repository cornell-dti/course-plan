from read_prereqs import get_all_classes_req_strs_from_semester
from prereq_parse import parse_prereq_coreq_string
from firebase_config import (
    courses_collection,
)


def write_prereqs(semester):
    req_str_dict = get_all_classes_req_strs_from_semester(semester)
    for course in req_str_dict:
        raw_str = req_str_dict[course]
        (prereqs, coreqs) = parse_prereq_coreq_string(raw_str)
        subject = course.split(" ")[0]
        course_number = course.split(" ")[1]
        course_ref = (
            courses_collection.document(semester)
            .document(subject)
            .document(course_number)
        )
        course_ref.update({"prereqs": prereqs})
        course_ref.update({"coreqs": coreqs})


def write_cs_4780():
    course = "CS 4780"
    prereqs = "Prereqs"
    coreqs = "Coreqs"
    subject = course.split(" ")[0]
    course_number = course.split(" ")[1]
    course_ref = (
        courses_collection.document("FA23").collection(subject).document(course_number)
    )
    print("have course_ref")
    course_ref.update({"prereqs": prereqs})
    print("updated prereqs")
    course_ref.update({"coreqs": coreqs})
    print("updated coreqs")


if __name__ == "__main__":
    write_cs_4780()
