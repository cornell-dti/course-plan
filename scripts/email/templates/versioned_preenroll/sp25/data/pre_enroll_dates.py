# NOTE: not sure how graduate students are handled in the DB?
# Oct 29 - Oct 31 -> this would send to Graduate/Professional/Cornell Tech
# TODO: check how VTMED students put their graduation year — do they put it as 2026 or 2025?
# TODO: what about architecture students? Also have a five year program iirc.

PRE_ENROLL_DATES = {
    ("2025", "2026-VTMED"): {
        "start_date": "Oct 30",
        "end_date": "Nov 01",
    },  # seniors and ved met fourth years;
    ("2026", "2027-VTMED"): {
        "start_date": "Nov 04",
        "end_date": "Nov 06",
    },  # juniors and vet med third years
    ("2027", "2028-VTMED"): {
        "start_date": "Nov 05",
        "end_date": "Nov 07",
    },  # sophomores and vet med second years
    ("2028", "2029-VTMED"): {
        "start_date": "Nov 06",
        "end_date": "Nov 08",
    },  # first years and vet med first years
}
