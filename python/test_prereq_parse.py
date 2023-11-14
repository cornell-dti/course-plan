from prereq_parse import (
    _get_raw_prereqs_and_coreqs,
    _get_prereqs_coreqs,
    _parse_boolean_string,
)
import os
import pytest


@pytest.mark.skipif(os.environ.get("RUN_LANGCHAIN_TESTS") == "false", reason="skip")
def test_raw_prereqs_coreqs(verbose=False):
    test_cases = [
        ("Recommended prerequisite: GOVT 1111.", ([], [])),
        (
            "Prerequisite: completed internship, professional experience, or significant undergraduate research; familiarity with HTML, CSS, and/or website development.",
            ([], []),
        ),
        (
            "Prerequisite: MATH 1920 or PHYS 1112. Corequisite: MATH 2930 or PHYS 2213.",
            (["MATH 1920", "PHYS 1112"], ["MATH 2930", "PHYS 2213"]),
        ),
        ("Corequisite: PSYCH 1102.", ([], ["PSYCH 1102"])),
        ("Corequisite: LA 5010 or permission of instructor.", ([], ["LA 5010"])),
        ("Prerequisite: HADM 4300.", (["HADM 4300"], [])),
        (
            "Prerequisite: CS 4780 and demonstrated knowledge of linear algebra and probability.",
            (["CS 4780"], []),
        ),
        (
            "Prerequisite: AEM 2100, AEM 2420, AEM 2010, or equivalent.",
            (["AEM 2100", "AEM 2420", "AEM 2010"], []),
        ),
        (
            "Prerequisite: MATH 1110 with a grade of C or better, excellent performance in MATH 1106, or equivalent AP credit.",
            (["MATH 1110", "MATH 1106"], []),
        ),
        (
            "Prerequisite: BTRY 3010, CS 2110 or equivalents.",
            (["BTRY 3010", "CS 2110"], []),
        ),
        (
            "Prerequisite: VIEN 2204 and VIEN 2205/FDSC 2205.",
            (["VIEN 2204", "VIEN 2205", "FDSC 2205"], []),
        ),
        (
            "Prerequisites: STSCI 2110 or PSYCH 2500 or SOC 3010 or ECON 3110 or equivalent.",
            (["STSCI 2110", "PSYCH 2500", "SOC 3010", "ECON 3110"], []),
        ),
        (
            "Prerequisite: general chemistry (CHEM 1560, CHEM 2070, and/or CHEM 2080), organic chemistry (CHEM 1570, CHEM 3570, and/or CHEM 3580), and Food Chemistry I (FDSC 4170).",
            (
                [
                    "CHEM 1560",
                    "CHEM 2070",
                    "CHEM 2080",
                    "CHEM 1570",
                    "CHEM 3570",
                    "CHEM 3580",
                    "FDSC 4170",
                ],
                [],
            ),
        ),
        (
            "Prerequisite: MATH 2210-MATH 2220, MATH 2230-MATH 2240, MATH 1920-MATH 2940, or equivalent.",
            (
                [
                    "MATH 2210",
                    "MATH 2220",
                    "MATH 2230",
                    "MATH 2240",
                    "MATH 1920",
                    "MATH 2940",
                ],
                [],
            ),
        ),
        (
            "Prerequisite: PHYS 2208 and CHEM 2080, or MATH 2130 or MATH 2310 or MATH 2220, or permission of instructor.",
            (["PHYS 2208", "CHEM 2080", "MATH 2130", "MATH 2310", "MATH 2220"], []),
        ),
        (
            "Prerequisite: background equivalent to MATH 2930 and elements of MSE 2610, or permission of instructor.",
            (["MATH 2930", "MSE 2610"], []),
        ),
    ]
    for test in test_cases:
        (course_desc, answer) = test
        response = _get_raw_prereqs_and_coreqs(course_desc)
        assert response == answer


@pytest.mark.skipif(os.environ.get("RUN_LANGCHAIN_TESTS") == "false", reason="skip")
def test_prereqs_coreqs(index=None, shorten=False, verbose=False, hard=False):
    test_cases = [
        ("Recommended prerequisite: GOVT 1111.", ("", "")),
        (
            "Prerequisite: completed internship, professional experience, or significant undergraduate research; familiarity with HTML, CSS, and/or website development.",
            ("", ""),
        ),
        (
            "Prerequisite: MATH 1920 or PHYS 1112. Corequisite: MATH 2930 or PHYS 2213.",
            ("(MATH 1920 OR PHYS 1112)", "(MATH 2930 OR PHYS 2213)"),
        ),
        ("Corequisite: PSYCH 1102.", ("", "PSYCH 1102")),
        ("Corequisite: LA 5010 or permission of instructor.", ("", "LA 5010")),
        ("Prerequisite: HADM 4300.", ("HADM 4300", "")),
        (
            "Prerequisite: CS 4780 and demonstrated knowledge of linear algebra and probability.",
            ("CS 4780", ""),
        ),
        (
            "Prerequisite: AEM 2100, AEM 2420, AEM 2010, or equivalent.",
            ("AEM 2100 OR AEM 2420 OR AEM 2010", ""),
        ),
        (
            "Prerequisite: MATH 1110 with a grade of C or better, excellent performance in MATH 1106, or equivalent AP credit.",
            ("MATH 1110 AND MATH 1106", ""),
        ),
        (
            "Prerequisite: BTRY 3010, CS 2110 or equivalents.",
            ("BTRY 3010 AND CS 2110", ""),
        ),
        (
            "Prerequisite: VIEN 2204 and VIEN 2205/FDSC 2205.",
            ("VIEN 2204 AND (VIEN 2205 OR FDSC 2205)", ""),
        ),
        (
            "Prerequisites: STSCI 2110 or PSYCH 2500 or SOC 3010 or ECON 3110 or equivalent.",
            ("STSCI 2110 OR PSYCH 2500 OR SOC 3010 OR ECON 3110", ""),
        ),
        (
            "Prerequisite: general chemistry (CHEM 1560, CHEM 2070, and/or CHEM 2080), organic chemistry (CHEM 1570, CHEM 3570, and/or CHEM 3580), and Food Chemistry I (FDSC 4170).",
            (
                "(CHEM 1560 OR CHEM 2070 OR CHEM 2080) AND (CHEM 1570 OR CHEM 3570 OR CHEM 3580) AND (FDSC 4170)",
                "",
            ),
        ),
        (
            "Prerequisite: MATH 2210-MATH 2220, MATH 2230-MATH 2240, MATH 1920-MATH 2940, or equivalent.",
            (
                "(MATH 2210 AND MATH 2220) OR (MATH 2230 AND MATH 2240) OR (MATH 1920 AND MATH 2940)",
                "",
            ),
        ),
        (
            "Prerequisite: PHYS 2208 and CHEM 2080, or MATH 2130 or MATH 2310 or MATH 2220, or permission of instructor.",
            ("(PHYS 2208 AND CHEM 2080) OR (MATH 2130 OR MATH 2310 OR MATH 2220)", ""),
        ),
        (
            "Prerequisite: background equivalent to MATH 2930 and elements of MSE 2610, or permission of instructor.",
            ("MATH 2930 AND MSE 2610", ""),
        ),
    ]
    for test in test_cases:
        (course_desc, answer) = test
        response = _get_prereqs_coreqs(course_desc)
        assert response == answer


def test_parse_boolean_string(verbose=False):
    test_cases = [
        ("", {}),
        ("CS 4780", {"type": "ATOM", "exprs": "CS 4780"}),
        (
            "AEM 2100 OR AEM 2420 OR AEM 2010",
            {
                "type": "OR",
                "exprs": [
                    {"type": "ATOM", "exprs": "AEM 2100"},
                    {"type": "ATOM", "exprs": "AEM 2420"},
                    {"type": "ATOM", "exprs": "AEM 2010"},
                ],
            },
        ),
        (
            "MATH 1110 AND MATH 1106",
            {
                "type": "AND",
                "exprs": [
                    {"type": "ATOM", "exprs": "MATH 1110"},
                    {"type": "ATOM", "exprs": "MATH 1106"},
                ],
            },
        ),
        (
            "BTRY 3010 AND CS 2110",
            {
                "type": "AND",
                "exprs": [
                    {"type": "ATOM", "exprs": "BTRY 3010"},
                    {"type": "ATOM", "exprs": "CS 2110"},
                ],
            },
        ),
        (
            "VIEN 2204 AND (VIEN 2205 OR FDSC 2205)",
            {
                "type": "AND",
                "exprs": [
                    {"type": "ATOM", "exprs": "VIEN 2204"},
                    {
                        "type": "OR",
                        "exprs": [
                            {"type": "ATOM", "exprs": "VIEN 2205"},
                            {"type": "ATOM", "exprs": "FDSC 2205"},
                        ],
                    },
                ],
            },
        ),
        (
            "STSCI 2110 OR PSYCH 2500 OR SOC 3010 OR ECON 3110",
            {
                "type": "OR",
                "exprs": [
                    {"type": "ATOM", "exprs": "STSCI 2110"},
                    {"type": "ATOM", "exprs": "PSYCH 2500"},
                    {"type": "ATOM", "exprs": "SOC 3010"},
                    {"type": "ATOM", "exprs": "ECON 3110"},
                ],
            },
        ),
        (
            "(CHEM 1560 OR CHEM 2070 OR CHEM 2080) AND (CHEM 1570 OR CHEM 3570 OR CHEM 3580) AND FDSC 4170",
            {
                "type": "AND",
                "exprs": [
                    {
                        "type": "OR",
                        "exprs": [
                            {"type": "ATOM", "exprs": "CHEM 1560"},
                            {"type": "ATOM", "exprs": "CHEM 2070"},
                            {"type": "ATOM", "exprs": "CHEM 2080"},
                        ],
                    },
                    {
                        "type": "OR",
                        "exprs": [
                            {"type": "ATOM", "exprs": "CHEM 1570"},
                            {"type": "ATOM", "exprs": "CHEM 3570"},
                            {"type": "ATOM", "exprs": "CHEM 3580"},
                        ],
                    },
                    {"type": "ATOM", "exprs": "FDSC 4170"},
                ],
            },
        ),
        (
            "(MATH 2210 AND MATH 2220) OR (MATH 2230 AND MATH 2240) OR (MATH 1920 AND MATH 2940)",
            {
                "type": "OR",
                "exprs": [
                    {
                        "type": "AND",
                        "exprs": [
                            {"type": "ATOM", "exprs": "MATH 2210"},
                            {"type": "ATOM", "exprs": "MATH 2220"},
                        ],
                    },
                    {
                        "type": "AND",
                        "exprs": [
                            {"type": "ATOM", "exprs": "MATH 2230"},
                            {"type": "ATOM", "exprs": "MATH 2240"},
                        ],
                    },
                    {
                        "type": "AND",
                        "exprs": [
                            {"type": "ATOM", "exprs": "MATH 1920"},
                            {"type": "ATOM", "exprs": "MATH 2940"},
                        ],
                    },
                ],
            },
        ),
        (
            "(PHYS 2208 AND (CHEM 2080 OR MATH 2090)) OR (MATH 2130 OR MATH 2310 OR MATH 2220)",
            {
                "type": "OR",
                "exprs": [
                    {
                        "type": "AND",
                        "exprs": [
                            {"type": "ATOM", "exprs": "PHYS 2208"},
                            {
                                "type": "OR",
                                "exprs": [
                                    {"type": "ATOM", "exprs": "CHEM 2080"},
                                    {"type": "ATOM", "exprs": "MATH 2090"},
                                ],
                            },
                        ],
                    },
                    {
                        "type": "OR",
                        "exprs": [
                            {"type": "ATOM", "exprs": "MATH 2130"},
                            {"type": "ATOM", "exprs": "MATH 2310"},
                            {"type": "ATOM", "exprs": "MATH 2220"},
                        ],
                    },
                ],
            },
        ),
    ]

    for test in test_cases:
        (boolean_string, answer) = test
        response = _parse_boolean_string(boolean_string)
        assert response == answer


if __name__ == "__main__":
    test_parse_boolean_string()
