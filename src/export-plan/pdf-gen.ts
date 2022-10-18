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
import {getCollegeAbbr} from '@/requirements/data/index'
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

  for (var sem of sems) {

    var headerHeight = rowHeight * (2 + sem.courses.length)
    if (sem.courses.length == 0) headerHeight = rowHeight

    console.log(headerHeight)
    var [body, groups, colours] =  getCourseRows(sem)

    var estimatedHeight = estimateTableHeight(body)
    if (estimatedHeight + startct + 35 > doc.internal.pageSize.height) {
      doc.addPage()
      startct = 70
    }
    
    doc.setFillColor(212, 229, 230)
    doc.roundedRect(tableX, startct - rowHeight, tableWidth, headerHeight, 4, 4, "F")

    doc.setFont("ProximaNova-Bold", "bold");
    doc.text(`${sem.season} ${sem.year}`, tableX + 20, startct - 6)
    doc.setFont("ProximaNova-Regular", "normal");


    var emojiPath: string
    switch (sem.season) {
      case "Fall": {
      emojiPath = "src/assets/images/pdf-gen/fall.png"
      break}
      case "Spring": {
      emojiPath = "src/assets/images/pdf-gen/spring.png"
    break}
      case "Summer": {
      emojiPath = "src/assets/images/pdf-gen/summer.png"
    break}
      case "Winter": {
      emojiPath = "src/assets/images/pdf-gen/winter.png"
    break}
    }
    let emoji = new Image()
    emoji.src = emojiPath
    doc.addImage(emoji, 'svg', tableX + 5, startct - 15.5, 12, 12)

    var tableHeight = rowHeight


    if (sem.courses.length > 0) {
    autoTable(doc, {
      head: tableHeader,
      body: body,
      margin: {left: tableX, bottom: 0},
      startY: startct,
      pageBreak: 'auto',
      tableWidth: tableWidth,
      theme: undefined,
      styles: {fontSize: rowFontSize, font: 'ProximaNova-Regular', fillColor: [255, 255, 255], cellPadding: {top: 2.94, bottom: 2.94, left: 5, right: 5}},
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
  }

    doc.setDrawColor(216, 216, 216)
    doc.setLineWidth(0.5)
    doc.roundedRect(tableX, startct - rowHeight, tableWidth, tableHeight, 4, 4)
    startct += tableHeight + tableGap;

  
}

  const footerY = doc.internal.pageSize.height - 25
  const footerX = (doc.internal.pageSize.width - doc.getTextWidth("downloaded from courseplan.io"))/2
  doc.text("downloaded from ", footerX, footerY, {align: 'left'})
  doc.textWithLink("courseplan.io", footerX + doc.getTextWidth("downloaded from "), footerY, {url: "https://courseplan.io"})
  doc.setDrawColor(0)
  doc.line(footerX + doc.getTextWidth("downloaded from "), footerY + 3, footerX + doc.getTextWidth("downloaded from courseplan.io"), footerY + 3)
  const pdfName = `${store.state.userName.firstName}'s CoursePlan`
  doc.save(pdfName)
    
  }


  




const getCourseRows = (sem: FirestoreSemester): [string[][], string[][], string[][]] => {
  const filteredCourses = sem.courses.filter((course): course is FirestoreSemesterCourse => !isPlaceholderCourse(course))
  var rows = filteredCourses.map(course => {
    var [reqs, groups, colours] = getFulfilledReqs(course)
    return [[`${course.code}: ${course.name}`, course.credits.toString(), reqs.join("\n")], groups, colours]
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

const estimateTableHeight = (body: string[][]): number => {
  const courseCharPerLine = 50

  var height = rowHeight * 2
  body.forEach((row, index) => {
    var numberOfLines = Math.max(row[0].length / courseCharPerLine, row[2].split('\n').length)
    height += numberOfLines * (rowFontSize + 4)
  })
  return height
}