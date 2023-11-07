from read_prereqs import get_all_classes_req_strs_from_semester
from prereq_parse import parse_prereq_coreq_string
from firebase_config import (
    courses_collection,
    available_rosters_for_course_collection,
    crse_id_to_catalog_nbr_collection,
)


def write_prereqs(semester):
    req_str_dict = get_all_classes_req_strs_from_semester(semester)
    for course in req_str_dict:
        raw_str = req_str_dict[course]
        (prereqs, coreqs) = parse_prereq_coreq_string(raw_str)
