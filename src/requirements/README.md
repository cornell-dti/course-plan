# Requirements Data
The requirements data and its interpreting algorithm is uniquely developed by and for CoursePlan. The data for requirements data can be accessed at `requirements/reqs.json`. The structure is designed to be able to accurately express almost all requirements at Cornell while making it as easy as possible to read and maintain. Here's an example of the data for the College of Engineering.

```json
"EN": {
	"name": "Engineering",
	"requirements": [
		{
			"name": "Mathematics",
			"description": "MATH 1910, 1920, 2930 or 2940, and a mathematics course chosen by the Major.",
			"source": "https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements",
			"search": ["code"],
			"includes": [["MATH 1910"], ["MATH 1920"], ["MATH 2930", "MATH 2940"]],
			"excludes": [["CS 1810"]],
			"fulfilledBy": "credits",
			"minCount": 14
		},
		{
			"name": "Freshman Writing Seminars",
            "description": "All students are required to take two first-year writing seminars",
            "source": "https://www.engineering.cornell.edu/students/undergraduate-students/curriculum/undergraduate-requirements",
			"search": ["catalogSatisfiesReq", "catalogComments"],
			"includes": [["First-Year Writing Seminar."]],
			"fulfilledBy": "credits",
			"minCount": 6
		}
	]
}
```

| Attribute | Description | Value |
| ------------ | ------------ | ------------ |
|  name | full name of the requirement | any string  |
| description  | description of the requirement  | string copied from source  |
| source | the soure with more information on the requirement | a URL string |
| search | (optional if fulfilledBy exists) the command(s) used to determine whether courses satisfy the requirement | (special search: all, all-elidgible, code) or any attribute in course object |
| includes | the query that uses the search command to find courses that fulfills requirement | a string that is an value in course data (e.g CS 2110, MQR-AS) |
| excludes | (optional) the query that uses the search command to find courses that does not fulfill requirement | a string that is an value in course data (e.g CS 2110, MQR-AS) |
| fulfilledBy | the metric that tracks the requirement completion progress | credits, courses, or self-check |
| minCount | the minimum number of fulfilledBy count | any positive integer |
| progressBar | (optional) whether this requirement should be the one requirement displayed in the progress bar | boolean |

The `includes` and `excludes` attribute has its own logic that uses nested arrays. The outer array lists all possible requirement queries, and the nested array allows for options. For example `[["CS 1110"], ["CS 2110", "CS 2112"]]` means that satisfying the requirement means both having CS 1110 and CS 2110 or CS 2112 on the board.