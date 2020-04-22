<template>
  <div id= "dashboard" class="dashboard">
    <onboarding class="dashboard-onboarding" v-if="isOnboarding"
      :isEditingProfile="isEditingProfile"
      :user="user"
      @onboard="endOnboarding"
      @cancelOnboarding="cancelOnboarding"
    />
    <div class="dashboard-mainView">
      <div class="dashboard-menus">
        <navbar class="dashboard-nav"
        @editProfile="editProfile"
        @toggleRequirementsBar="toggleRequirementsBar"
        :isBottomPreview="bottomBar.isPreview"
        />
        <requirements class="dashboard-reqs" v-if="loaded && (!isTablet || (isOpeningRequirements && isTablet))"
          :semesters="semesters"
          :user="user"
          :key="requirementsKey"
          @requirementsMap="loadRequirementsMap"
         />
      </div>
      <semesterview v-if="loaded && ((!isOpeningRequirements && isTablet) || !isTablet)"
        :semesters="semesters"
        :compact="compactVal"
        :isBottomBarExpanded="bottomBar.isExpanded"
        :isBottomBar="bottomCourses.length > 0"
        :isMobile="isMobile"

        @compact-updated="compactVal = $event"
        @updateBar="updateBar"
        @close-bar="closeBar"
        @updateRequirementsMenu="updateRequirementsMenu"
      />
    </div>
    <div id="dashboard-bottomView">
      <bottombar
      v-if="bottomCourses.length > 0 && ((!isOpeningRequirements && isTablet) || !isTablet)"
      :bottomCourses="bottomCourses"
      :seeMoreCourses="seeMoreCourses"
      :isExpanded="this.bottomBar.isExpanded"
      :maxBottomBarTabs="maxBottomBarTabs"
      @close-bar="closeBar"
      @open-bar="openBar"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import Course from '@/components/Course';
import SemesterView from '@/components/SemesterView';
import Requirements from '@/components/Requirements';
import BottomBar from '@/components/BottomBar';
import NavBar from '@/components/NavBar';
import Onboarding from '@/components/Modals/Onboarding';

import '@/vueDragulaConfig';
import { auth, userDataCollection } from '@/firebaseConfig';

Vue.component('course', Course);
Vue.component('semesterview', SemesterView);
Vue.component('requirements', Requirements);
Vue.component('bottombar', BottomBar);
Vue.component('navbar', NavBar);
Vue.component('onboarding', Onboarding);

export default {
  data() {
    const user = auth.currentUser;
    const names = user.displayName.split(' ');
    return {
      loaded: false,
      compactVal: false,
      currSemID: 1,
      semesters: [],
      firebaseSems: [],
      currentClasses: [],
      user: {
        major: [],
        majorFN: [],
        college: '',
        collegeFN: '',
        firstName: names[0],
        lastName: names[1],
        middleName: '',
        minor: [],
        minorFN: []
      },
      bottomCourses: [],
      seeMoreCourses: [],
      subjectColors: {},
      // Default bottombar info without info
      bottomBar: { isPreview: false, isExpanded: false },
      requirementsKey: 0,
      isOnboarding: false,
      isEditingProfile: false,
      isOpeningRequirements: false,
      isTablet: window.innerWidth <= 878,
      isMobile: window.innerWidth <= 440,
      maxBottomBarTabs: window.innerWidth <= 1347 ? 2 : 4
    };
  },
  created() {
    window.addEventListener('resize', this.resizeEventHandler);
  },
  mounted() {
    this.getInformationFromUser();
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEventHandler);
  },
  methods: {
    getDocRef() {
      const user = auth.currentUser;
      const userEmail = user.email;
      const docRef = userDataCollection.doc(userEmail);
      return docRef;
    },

    getInformationFromUser() {
      const docRef = this.getDocRef();

      // TODO: error handling for firebase errors
      docRef.get()
        .then(doc => {
          if (doc.exists) {
            this.semesters = this.convertSemesters(doc.data().semesters);
            this.firebaseSems = doc.data().semesters;
            this.user = this.parseUserData(doc.data().userData, doc.data().name);
            this.subjectColors = doc.data().subjectColors;
            this.loaded = true;
          } else {
            this.startOnboarding();
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    },

    resizeEventHandler(e) {
      this.isMobile = window.innerWidth <= 440;
      this.isTablet = window.innerWidth <= 878;
      this.maxBottomBarTabs = window.innerWidth <= 1347 ? 2 : 4;
      this.updateBarTabs();
      this.updateSemesterView();
    },

    toggleRequirementsBar() {
      this.isOpeningRequirements = !this.isOpeningRequirements;
    },

    convertSemesters(firebaseSems) {
      const semesters = [];

      firebaseSems.forEach(firebaseSem => {
        const firebaseCourses = firebaseSem.courses;
        const courses = [];
        firebaseCourses.forEach(firebaseCourse => {
          courses.push(this.createCourse(firebaseCourse));
        });
        semesters.push(this.createSemester(courses, firebaseSem.type, firebaseSem.year));
      });
      return semesters;
    },

    updateSemesterView() {
      if (this.isMobile) {
        // Make sure semesterView is not compact by default on mobile
        this.compactVal = false;
      }
    },

    /**
     * Creates credit range based on course
     * Example: [1, 4] is the credit range for the given course
     */
    createCourseCreditRange(course) {
      const courseCreditRange = [];
      if (typeof course.creditRange !== 'undefined') {
        return course.creditRange;
      }
      if (typeof course.enrollGroups !== 'undefined') {
        course.enrollGroups.forEach(enrollGroup => {
          courseCreditRange.push(enrollGroup.unitsMinimum);
          courseCreditRange.push(enrollGroup.unitsMaximum);
        });
        return [Math.min(...courseCreditRange), Math.max(...courseCreditRange)];
      }
      return [course.credits, course.credits];
    },

    /**
     * Creates a course on frontend with either user or API data
     */
    createCourse(course) {
      // TODO: id?
      const randomId = Math.floor(Math.random() * Math.floor(1000));

      const subject = (course.code && course.code.split(' ')[0]) || course.subject;
      const number = (course.code && course.code.split(' ')[1]) || course.catalogNbr;

      // TODO: same field?
      const name = course.titleLong || course.name;

      // Description of course. Please leave the redundancy in place as a sanity check.
      const description = course.description || course.description;

      // TODO Credits: Which enroll group, and min or max credits? And how is it stored for users
      const credits = course.credits || course.enrollGroups[0].unitsMaximum;
      const creditRange = course.creditRange || this.createCourseCreditRange(course);
      // Semesters: remove periods and split on ', '
      // alternateSemesters option in case catalogWhenOffered for the course is null, undef, or ''
      const catalogWhenOfferedDoesNotExist = (!course.catalogWhenOffered) || course.catalogWhenOffered === '';
      const alternateSemesters = (catalogWhenOfferedDoesNotExist) ? [] : course.catalogWhenOffered.replace(/\./g, '').split(', ');
      const semesters = course.semesters || alternateSemesters;

      // Get prereqs of course as string (). '' if neither available because '' is interpreted as false
      const prereqs = course.prereqs || course.catalogPrereqCoreq || '';

      // To be redefined if does not exist
      let { enrollment, lectureTimes, instructors } = course;

      if (!(enrollment || lectureTimes || instructors)) {
        // If new course, iterate through enrollment groups to retrieve enrollment info, lecture times, and instructors

        // Hash maps used to remove redundancies
        const enrollmentMap = {};
        const lectureTimesMap = {};
        const instructorsMap = {};
        course.enrollGroups.forEach(group => {
          group.classSections.forEach(section => {
            // Add section
            const enroll = section.ssrComponent;
            enrollmentMap[enroll] = true;

            section.meetings.forEach(meeting => {
              const { pattern, timeStart, timeEnd } = meeting;
              // Only add the time if it is a lecture
              if (enroll === 'LEC') lectureTimesMap[`${pattern} ${timeStart} - ${timeEnd}`] = true;

              meeting.instructors.forEach(instructor => {
                const { netid, firstName, lastName } = instructor;
                instructorsMap[netid] = `${firstName} ${lastName}`;
              });
            });
          });
        });

        enrollment = Object.keys(enrollmentMap);
        lectureTimes = Object.keys(lectureTimesMap);
        instructors = Object.keys(instructorsMap).map(netid => `${instructorsMap[netid]} (${netid})`);
      }

      // Distribution of course (e.g. MQR-AS)
      // alternateDistributions option in case catalogDistr for the course is null, undef, ''
      const catalogDistrDoesNotExist = (!course.catalogDistr) || course.catalogDistr === '';
      const alternateDistributions = (catalogDistrDoesNotExist) ? [''] : /\(([^)]+)\)/.exec(course.catalogDistr)[1].split(', ');
      const distributions = course.distributions || alternateDistributions;

      // Get last semester of available course. TODO: Remove when no longer firebase data dependant
      const lastRoster = course.lastRoster || course.roster;

      // Create course from saved color. Otherwise, create course from subject color group
      const color = course.color || this.addColor(subject);

      const alerts = { requirement: null, caution: null };

      const newCourse = {
        id: randomId,
        subject,
        number,
        name,
        description,
        credits,
        creditRange,
        semesters,
        prereqs,
        enrollment,
        lectureTimes,
        instructors,
        distributions,
        lastRoster,
        color,
        alerts,
        check: true
      };
      // Update requirements menu
      this.updateRequirementsMenu();

      return newCourse;
    },

    addColor(subject) {
      if (this.subjectColors && this.subjectColors[subject]) return this.subjectColors[subject];

      const colors = [
        {
          text: 'Red',
          hex: 'DA4A4A'
        },
        {
          text: 'Orange',
          hex: 'FFA53C'
        },
        {
          text: 'Yellow',
          hex: 'FFE142'
        },
        {
          text: 'Green',
          hex: '58C913'
        },
        {
          text: 'Blue',
          hex: '139DC9'
        },
        {
          text: 'Purple',
          hex: 'C478FF'
        },
        {
          text: 'Pink',
          hex: 'F296D3'
        }
      ];

      // If subjectColor attribute does not exist, make it an empty object
      if (this.subjectColors === undefined) this.subjectColors = {};

      // Create list of used colors
      const colorsUsedMap = {};
      for (const subjectKey of Object.keys(this.subjectColors)) {
        const subjectColor = this.subjectColors[subjectKey];
        colorsUsedMap[subjectColor] = true;
      }

      // Filter out used colors
      const unusedColors = colors.filter(color => !colorsUsedMap[color.hex]);

      let randomColor;

      // pick a color from unusedColors if there are any
      if (unusedColors.length !== 0) {
        randomColor = unusedColors[Math.floor(Math.random() * unusedColors.length)].hex;
      // otherwise pick a color following the random order set by the first 7 subjects
      } else {
        const colorIndex = Object.keys(this.subjectColors).length;
        const key = Object.keys(this.subjectColors)[colorIndex % colors.length];
        randomColor = this.subjectColors[key];
      }

      // Update subjectColors on Firebase with new subject color group
      const docRef = this.getDocRef();
      this.subjectColors[subject] = randomColor;
      docRef.update({ subjectColors: this.subjectColors });

      // Return randomly generated color
      return randomColor;
    },

    createSemester(courses, type, year) {
      const semester = {
        courses,
        id: this.currSemID,
        type,
        year
      };
      this.currSemID += 1;
      return semester;
    },

    updateRequirementsMenu() {
      this.requirementsKey += 1;
    },

    loadRequirementsMap(requirementsMap) {
      // Get map of requirements
      this.buildRequirementsAlert(requirementsMap);
    },

    buildRequirementsAlert(requirementsMap) {
      // Update semesters with alerts
      this.semesters.forEach(semester => {
        semester.courses.forEach(course => {
          const courseCode = `${course.subject} ${course.number}`;
          if (courseCode in requirementsMap) {
            // Add and to parse array to natural language
            const courseReqs = requirementsMap[courseCode];
            if (courseReqs.length > 1) {
              const listLength = courseReqs.length;
              courseReqs[listLength - 2] = `${courseReqs[listLength - 2]}, and ${courseReqs.pop()}`;
            }
            const parsedCourseReqs = `Satisfies ${courseReqs.join(', ')} Requirements`;
            course.alerts.requirement = parsedCourseReqs;
          }
        });
      });
    },

    updateBar(course, colorJustChanged, color) {
      // Update Bar Information
      const courseToAdd = {
        subject: course.subject,
        number: course.number,
        name: course.name,
        credits: course.credits,
        semesters: this.joinOrNAString(course.semesters),
        color: course.color,
        latestSem: course.lastRoster,
        // Array data
        instructors: this.joinOrNAString(course.instructors),
        distributionCategories: this.cleanCourseDistributionsArray(course.distributions),
        enrollmentInfo: this.joinOrNAString(course.enrollment),
        latestLecInfo: this.naIfEmptyStringArray(course.lectureTimes),
        // TODO: CUReviews data
        overallRating: 0,
        difficulty: 0,
        workload: 0,
        prerequisites: this.noneIfEmpty(course.prereqs),
        description: course.description
      };

      // expand bottombar if first course added
      if (this.bottomCourses.length === 0) {
        this.bottomBar.isExpanded = true;
      }

      // if course already exists in bottomCourses, first remove course
      for (let i = 0; i < this.bottomCourses.length; i += 1) {
        // if colorJustChanged and course already exists, just update course color
        if (this.bottomCourses[i].subject === course.subject && this.bottomCourses[i].number === course.number && colorJustChanged) {
          this.bottomCourses[i].color = color;
        } else if (this.bottomCourses[i].subject === course.subject && this.bottomCourses[i].number === course.number && !colorJustChanged) {
          this.bottomCourses.splice(i, 1);
        }
      }

      // Prepending bottomCourse to front of bottom courses array if bottomCourses < this.maxBottomBarTabs
      // Do not add course to bottomCourses if color was only changed
      if (this.bottomCourses.length < this.maxBottomBarTabs && !colorJustChanged) {
        this.bottomCourses.unshift(courseToAdd);
      } else { // else check no dupe in seeMoreCourses and add to seeMoreCourses
        for (let i = 0; i < this.seeMoreCourses.length; i += 1) {
          // if colorJustChanged and course already exists in seeMoreCourses, just update course color
          if (this.seeMoreCourses[i].subject === course.subject && this.seeMoreCourses[i].number === course.number && colorJustChanged) {
            this.seeMoreCourses[i].color = color;
          } else if (this.seeMoreCourses[i].subject === course.subject && this.seeMoreCourses[i].number === course.number && !colorJustChanged) {
            this.seeMoreCourses.splice(i, 1);
          }
        }
        // Do not move courses around from bottomCourses to seeMoreCourses if only color changed
        if (!colorJustChanged) {
          this.bottomCourses.unshift(courseToAdd);
          this.seeMoreCourses.unshift(this.bottomCourses[this.bottomCourses.length - 1]);
          this.bottomCourses.splice(this.bottomCourses.length - 1, 1);
        }
      }
      this.getReviews(course.subject, course.number, review => {
        this.bottomCourses[0].overallRating = review.classRating;
        this.bottomCourses[0].difficulty = review.classDifficulty;
        this.bottomCourses[0].workload = review.classWorkload;
      });
    },

    getReviews(subject, number, callback) {
      fetch(`https://www.cureviews.org/classInfo/${subject}/${number}/CY0LG2ukc2EOBRcoRbQy`).then(res => {
        res.json().then(reviews => {
          callback(reviews.classes[0]);
        });
      });
    },

    updateBarTabs() {
      // Move courses from see more to bottom tab to fulfill increased bottom tab capacity
      if (this.maxBottomBarTabs === 4 && this.bottomCourses.length < 4 && this.seeMoreCourses.length > 0) {
        while (this.bottomCourses.length < 4) {
          // if any See More courses exist, move first See More Course to end of tab
          if (this.seeMoreCourses.length > 0) {
            const seeMoreCourseToMove = this.seeMoreCourses[0];
            // remove course from See More Courses
            this.seeMoreCourses.splice(0, 1);

            // add course to end of bottomCourses
            this.bottomCourses.push(seeMoreCourseToMove);
          }
        }
      } else if (this.maxBottomBarTabs === 2 && this.bottomCourses.length > 2) {
        // Move courses from bottom tab to see more for decreased max of 2
        while (this.bottomCourses.length > 2) {
          const bottomCourseToMove = this.bottomCourses.pop();
          this.seeMoreCourses.unshift(bottomCourseToMove);
        }
      }
    },

    openBar() {
      this.bottomBar.isExpanded = true;
    },

    closeBar() {
      this.bottomBar.isExpanded = false;
    },

    startOnboarding() {
      this.isOnboarding = true;
    },

    endOnboarding(onboardingData) {
      const user = this.parseUserData(onboardingData.userData, onboardingData.name);

      this.user = user;
      this.loaded = true;

      const docRef = this.getDocRef();

      const data = {
        name: onboardingData.name,
        userData: onboardingData.userData,
        semesters: this.firebaseSems,
        subjectColors: this.subjectColors
      };

      // set the new name and userData, along with either an empty list of semesters or preserve the old list
      docRef.set(data);

      this.cancelOnboarding();
      this.updateRequirementsMenu();
    },

    cancelOnboarding() {
      this.isOnboarding = false;
    },

    parseUserData(data, name) {
      const user = {
        // TODO: take into account multiple majors and colleges
        college: data.colleges[0].acronym,
        collegeFN: data.colleges[0].fullName,
        firstName: name.firstName,
        middleName: name.middleName,
        lastName: name.lastName
      };

      if ('majors' in data && data.majors.length > 0) {
        const majors = [];
        const majorsFN = [];
        data.majors.forEach(major => {
          majors.push(major.acronym);
          majorsFN.push(major.fullName);
        });
        user.major = majors;
        user.majorFN = majorsFN;
      }

      if ('majors' in data && data.majors.length > 0) {
        const minors = [];
        const minorsFN = [];
        data.minors.forEach(minor => {
          minors.push(minor.acronym);
          minorsFN.push(minor.fullName);
        });
        user.minor = minors;
        user.minorFN = minorsFN;
      }
      return user;
    },

    editProfile() {
      this.isOnboarding = true;
      this.isEditingProfile = true;
    },

    cleanCourseDistributionsArray(distributions) {
      // Iterates over distributions array and cleans every entry
      // Removes stray parentheses, spaces, and commas
      let matches = [];
      if (distributions[0] === '') {
        matches = ['N/A'];
      } else {
        for (let i = 0; i < distributions.length; i += 1) {
          distributions[i].replace((/[A-Za-z0-9-]+/g), d => {
            matches.push(d);
          });
        }
      }

      return matches;
    },

    joinOrNAString(arr) {
      return (arr.length !== 0 && arr[0] !== '') ? arr.join(', ') : 'N/A';
    },

    noneIfEmpty(str) {
      return (str && str.length !== 0) ? str : 'None';
    },

    naIfEmptyStringArray(arr) {
      return (arr && arr.length !== 0 && arr[0] !== '') ? arr : ['N/A'];
    }
  }
};
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;

  &-mainView {
    display: flex;
  }

  &-menus {
    display: flex;
  }

  &-reqs {
    margin-left: 4.5rem;
  }

  /* The Modal (background) */
  &-onboarding {
    position: fixed; /* Stay in place */
    z-index: 2; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }
}

.semester {
  margin: 1rem;
  padding: 1rem;
  height: 12.12rem;
}


@media only screen and (max-width: 878px) {
  .dashboard {
    &-nav {
      width: 100%;
      flex-direction: row;
      height: 4.5rem;
      padding-top: 0rem;
      padding-bottom: 0rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      position: fixed;
      z-index: 1;
    }
  }
}
</style>
