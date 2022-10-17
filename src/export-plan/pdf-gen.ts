import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

import { db } from '../firebase-frontend-config';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import {
  getCollegeFullName,
  getMajorFullName,
  getMinorFullName,
  sortedSemesters,
  isPlaceholderCourse,
} from '../utilities';
import store from '../store';
import {addFonts} from './add-fonts';
import { render } from '@vue/runtime-dom';
import introJs from 'intro.js';
import {getCollegeAbbr} from '@/requirements/data/index'
import { cornellCourseRosterCourseDetailedInformationToPartialBottomCourseInformation } from '@/user-data-converter';
import json from '@/assets/courses/full-courses.json';
import decoratedRequirementJson from '@/requirements/typed-requirement-json';

const rowHeight = 18
const tableWidth = 516
// vertical space between tables for two semesters
const tableGap = 20
const firstTableY = 170

const rowFontSize = 10.5
const headerFontSize = 10.5

const grey = [117, 117, 117]

const reqsToFilterOut = ["A&S Credits"]

export const genPDF = (
): void => {
  // It can parse html:
  // <table id="my-table"><!-- ... --></table>
  // autoTable(doc, { html: '#my-table' })

  const doc = new jsPDF({unit: "pt", format: "letter"})

  addFonts(doc)
  doc.setFont("ProximaNova-Regular", "normal");

  const tableX = (doc.internal.pageSize.width - tableWidth) / 2

  let img = new Image()
  img.src = "src/assets/cp-logo-pdf.png"
  doc.addImage(img, 48, 30, 84, 23.25);

  doc.setFontSize(10.5)

  doc.text('Name:', 48, 76)

  doc.text('College:', 48, 93.2)
  doc.text('Major:', 48, 110)
  doc.text('Minor:', 48, 127.5)

  doc.text('Entrance Date:', 344, 76)
  doc.text('Graduation Date:', 344, 93.2)

  doc.setTextColor(117, 117, 117)

  // TODO: include middle name
  doc.text(`${store.state.userName.firstName} ${store.state.userName.lastName}`, 100.3, 76)

  doc.text(getCollegeFullName(store.state.onboardingData.college), 100.3, 93.2)
  doc.text(store.state.onboardingData.major.map(major => getMajorFullName(major)).join(", "), 100.3, 110)
  doc.text(store.state.onboardingData.minor.map(minor => getMinorFullName(minor)).join(", "), 100.3, 127.5)

  doc.text(`${store.state.onboardingData.entranceSem} ${store.state.onboardingData.entranceYear}`.trim(), 452, 76)
  doc.text(`${store.state.onboardingData.gradSem} ${store.state.onboardingData.gradYear}`.trim(), 452, 93.2)

  doc.setTextColor(0)

  var sems = sortedSemesters(store.state.semesters, false)
  var sems = trimEmptySems(sems)
  const tableHeader = [['Courses', 'Credits', 'Requirements Fulfilled']]
  console.log(doc.internal.pageSize.width)
  console.log(sems)
  var startct = firstTableY;

  // getFulfilledReqs(sems)
  for (var sem of sems) {

    var tableHeight = rowHeight * (2 + sem.courses.length)
    if (sem.courses.length == 0) tableHeight = rowHeight

    doc.setFillColor(212, 229, 230)

    console.log(tableHeight)
    doc.roundedRect(tableX, startct - rowHeight, tableWidth, tableHeight, 4, 4, "F")

    doc.setFont("ProximaNova-Bold", "bold");
    doc.text(`${sem.season} ${sem.year}`, tableX + 10, startct - 6)
    doc.setFont("ProximaNova-Regular", "normal");

    if (sem.courses.length > 0) {
      var [body, groups, colours] =  getCourseRows(sem)
    autoTable(doc, {
      head: tableHeader,
      body: body,
      margin: tableX,
      startY: startct,
      pageBreak: 'auto',
      tableWidth: tableWidth,
      // theme: 'grid',
      theme: undefined,
      // tableLineColor: [255, 255, 255],
      // tableLineWidth: 0.5,
      styles: {fontSize: rowFontSize, font: 'ProximaNova-Regular', fillColor: [255, 255, 255], cellPadding: 2.94},
      // bodyStyles: {lineColor: [0, 0, 0]},
      headStyles: {fontSize: headerFontSize, valign: 'middle',
      halign : 'center', fillColor: [255, 255, 255], textColor: 0,
    lineWidth: 0.5,
    font: 'ProximaNova-Bold',
  lineColor: [216, 216, 216]},
      columnStyles: {
        0: {cellWidth: 266},
        1: {cellWidth: 50},
        2: {cellWidth: 200},
      },
      // didDrawPage: data => {
      //   data.
      // },
      didParseCell: data => {
        data.cell.styles.lineColor = [216, 216, 216]
        data.cell.styles.lineWidth = 0.5
      },
      willDrawCell: data => {
        doc.setFillColor(255, 255, 255)
        if (data.row.index == sem.courses.length - 1) {
          doc.setDrawColor(255, 255, 255)
          data.cell.styles.lineWidth = 0.5
     }
      },
      didDrawCell: data => {
        // data.row.height = rowHeight
        if (data.row.index == sem.courses.length - 1) {
          doc.setDrawColor(216, 216, 216)
          doc.setLineWidth(.5);
          // draw middle vertical borders for last row
          if (data.column.index > 0) doc.line(data.cell.x, data.cell.y + data.row.height, data.cell.x, data.cell.y);
          // draw top horizontal border for last row
          doc.line(data.cell.x + data.column.width, data.cell.y, data.cell.x, data.cell.y);
      }

      tableHeight = data.cell.y + data.row.height - startct + rowHeight

      if (data.column.index == 2 && data.section == "body" && data.row.index >= 0 && data.row.index < body.length) {
        console.log(data.row.index)
        var yPos = data.cell.y + 3
        groups[data.row.index].forEach((group, index) => {

          var xPos = data.cell.x + doc.getTextWidth(body[data.row.index][2].split("\n")[index]) + 8
          // data.cell.x + data.cell.contentHeight + 5
          console.log(data.cell.text.length)
          console.log(data.cell.contentWidth)
          // console.log(body[data.row.index])
          console.log(body[data.row.index][2].split("\n")[index])
          
          var colour = colours[data.row.index][index]

          renderBubbles(doc, xPos, yPos, group, colour)
          yPos += rowFontSize + 1.5
        })
      }
      }
    })

    sem.courses.forEach((index, course) => {
      // renderBubbles(index, course)
    })
  }

    doc.setDrawColor(216, 216, 216)
    doc.setLineWidth(0.5)
    doc.roundedRect(tableX, startct - rowHeight, tableWidth, tableHeight, 4, 4)
    startct += tableHeight + tableGap;
    
  }


  doc.save('table.pdf')
};



const getCourseRows = (sem: FirestoreSemester): [string[][], string[][], string[][]] => {
  const filteredCourses = sem.courses.filter((course): course is FirestoreSemesterCourse => !isPlaceholderCourse(course))
  var rows = filteredCourses.map(course => {
    var [reqs, groups, colours] = getFulfilledReqs(course)
    return [[course.name, course.credits.toString(), reqs.join("\n")], groups, colours]
  })

  return [rows.map(row => row[0]), rows.map(row => row[1]), rows.map(row => row[2])]

}

const trimEmptySems = (sems: readonly FirestoreSemester[]): readonly FirestoreSemester[] => {
  var max_nonempty_index = -1
  for (var i = 0; i < sems.length; i++) {
    if (sems[i].courses.length > 0) max_nonempty_index = i
  }
  return sems.slice(0, max_nonempty_index + 1)
}

const getFulfilledReqs = (course: FirestoreSemesterCourse): readonly [string[], string[], string[]] => {
  var reqsFulfilled = store.state.safeRequirementFulfillmentGraph.getConnectedRequirementsFromCourse({uniqueId: course.uniqueID})
  reqsFulfilled = reqsFulfilled.filter(req => !(reqsToFilterOut.includes(store.state.userRequirementsMap[req].name)))
  return [reqsFulfilled.map(req => store.state.userRequirementsMap[req].name), 
  reqsFulfilled.map(req => 
    {switch(store.state.userRequirementsMap[req].sourceType) {
      case 'College': {return getCollegeAbbr(store.state.userRequirementsMap[req].sourceSpecificName)}
      case 'Grad': {return "grad"}
      case 'Major':
      case 'Minor': {return store.state.userRequirementsMap[req].sourceSpecificName.toLowerCase()}
    }}),
    reqsFulfilled.map(req => 
      {switch(store.state.userRequirementsMap[req].sourceType) {
        case 'College': {return store.state.userRequirementsMap[req].sourceSpecificName == "UNI" ? "#1AA9A5" : "#4F7D91"}
        // using the same colours for major and grad reqs
        case 'Grad': 
        case 'Major': {return "#1E8481"}
        case 'Minor': {return "#145351"}
      }})]
}

const renderBubbles = (doc: jsPDF, xPos: number, yPos: number, text: string, colour: string) => {
  doc.setFillColor(colour)
  const bubbleWidth =  8 + (text.length) * 5.5
  doc.roundedRect(xPos, yPos, bubbleWidth, 11, 6, 6, "F")
  doc.setTextColor(256, 256, 256)
  doc.text(text, xPos + bubbleWidth/2, yPos + 8.5, {align: "center"})
}