import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import url from '@/assets/cp-logo-pdf.png';
import fallEmojiURL from '@/assets/images/pdf-gen/fall.png';
import springEmojiURL from '@/assets/images/pdf-gen/spring.png';
import summerEmojiURL from '@/assets/images/pdf-gen/summer.png';
import winterEmojiURL from '@/assets/images/pdf-gen/winter.png';
import { lightPlaceholderGray, borderGray } from '@/assets/constants/scss-variables';
import { pdfColors } from '@/assets/constants/colors';
import userDataToExamCourses from '../requirements/requirement-exam-utils';

import {
  getCollegeFullName,
  getMajorFullName,
  getMinorFullName,
  getGradFullName,
  sortedSemesters,
  isPlaceholderCourse,
  isCourseTaken,
} from '../utilities';
import store from '../store';
import { addFonts } from './add-fonts';
import { getCollegeAbbrev } from '../requirements/data';

const rowHeight = 18;
const tableWidth = 516;
// vertical space between tables for two semesters
const tableGap = 20;
// starting y co-ordinate of the first table
const firstTableY = 170;

const rowFontSize = 10.5;
const headerFontSize = 10.5;

const tableHeader = [['Course', 'Credits', 'Requirements Fulfilled']];
const APIBTableHeader = [['Exam', 'Credits', 'Requirements Fulfilled']];

/**
 * List of requirements to not display in the PDF.
 * We filter these out because they apply to almost every course, and make the
 * PDF somewhat messy.
 */
const reqsToFilterOut = ['A&S Credits'];

/**
 * Maps from requirement groups to the appropriate colored bubble
 */
const bubbleColorMap: Record<RequirementGroupType, (req?: string) => string> = {
  College: (req?: string) =>
    req && store.state.userRequirementsMap[req].sourceSpecificName === 'UNI'
      ? pdfColors.turquoise
      : pdfColors.collegeBlue,
  Grad: () => pdfColors.majorTeal,
  Major: () => pdfColors.majorTeal,
  Minor: () => pdfColors.minorDarkTeal,
};

/**
 * Asynchronously load an image
 *
 * @param src the source URL of the image to load
 * @returns a promise wrapping the loaded image
 */
const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = err => reject(err);
  });

const generatePDF = async (): Promise<void> => {
  const doc = new JsPDF({ unit: 'pt', format: 'letter' });

  addFonts(doc);
  doc.setFont('ProximaNova-Regular', 'normal');

  // rendering PDF header
  const tableX = (doc.internal.pageSize.width - tableWidth) / 2;

  const img = await loadImage(url);
  doc.addImage(img, 'PNG', 48, 30, 84, 23.25);

  doc.setFontSize(10.5);

  doc.text('Name:', 48, 76);
  doc.text('College:', 48, 93.2);

  doc.text('Entrance Date:', 354, 76);
  doc.text('Graduation Date:', 354, 93.2);

  doc.text('college req', 365, 110);
  doc.text('major req', 365, 127.5);
  doc.text('minor req', 459, 110);
  doc.text('other courses', 459, 127.5);

  doc.setFillColor(bubbleColorMap.College());
  doc.circle(357, 107, 3, 'F');
  doc.setFillColor(bubbleColorMap.Major());
  doc.circle(357, 124.5, 3, 'F');
  doc.setFillColor(bubbleColorMap.Minor());
  doc.circle(451, 107, 3, 'F');
  doc.setFillColor(pdfColors.turquoise);
  doc.circle(451, 124.5, 3, 'F');
  doc.setTextColor(lightPlaceholderGray);

  doc.text(
    `${store.state.userName.firstName} ${
      store.state.userName.middleName ? `${store.state.userName.middleName} ` : ''
    }${store.state.userName.lastName}`,
    100.3,
    76
  );
  doc.text(getCollegeFullName(store.state.onboardingData.college), 100.3, 93.2);

  let programY = 110;
  if (store.state.onboardingData.grad) {
    doc.setTextColor('#000000');
    doc.text('Graduate:', 48, programY);
    doc.setTextColor(lightPlaceholderGray);
    doc.text(getGradFullName(store.state.onboardingData.grad), 100.3, programY);
    programY += 17.5;
  }

  if (store.state.onboardingData.major.length > 0) {
    doc.setTextColor('#000000');
    doc.text('Major:', 48, programY);
    doc.setTextColor(lightPlaceholderGray);
    doc.text(
      store.state.onboardingData.major.map(major => getMajorFullName(major)).join(', '),
      100.3,
      programY
    );
    programY += 17.5;
  }

  if (store.state.onboardingData.minor.length > 0) {
    doc.setTextColor('#000000');
    doc.text('Minor:', 48, programY);
    doc.setTextColor(lightPlaceholderGray);
    doc.text(
      store.state.onboardingData.minor.map(minor => getMinorFullName(minor)).join(', '),
      100.3,
      programY
    );
    programY += 17.5;
  }

  doc.text(
    `${store.state.onboardingData.entranceSem} ${store.state.onboardingData.entranceYear}`.trim(),
    448,
    76
  );
  doc.text(
    `${store.state.onboardingData.gradSem} ${store.state.onboardingData.gradYear}`.trim(),
    448,
    93.2
  );

  doc.setTextColor('#000000');

  // Rendering tables now
  const sems = trimEmptySems(sortedSemesters(store.state.semesters, false));
  let startct = Math.max(firstTableY, programY + 20);

  const emojiMap = {
    Fall: await loadImage(fallEmojiURL),
    Spring: await loadImage(springEmojiURL),
    Summer: await loadImage(summerEmojiURL),
    Winter: await loadImage(winterEmojiURL),
  };

  for (const sem of sems) {
    let headerHeight = rowHeight * (2 + sem.courses.length);
    if (sem.courses.length === 0) headerHeight = rowHeight;

    const { body, bubbles } = getCourseRows(sem.courses);

    const estimatedHeight = estimateTableHeight(body);
    if (estimatedHeight + startct + 35 > doc.internal.pageSize.height) {
      doc.addPage();
      startct = 70;
    }

    doc.setFillColor(pdfColors.backgroundTurquoise);
    doc.roundedRect(tableX, startct - rowHeight, tableWidth, headerHeight, 4, 4, 'F');

    doc.setFont('ProximaNova-Bold', 'bold');
    doc.text(`${sem.season} ${sem.year}`, tableX + 20, startct - 6);

    const emoji = emojiMap[sem.season];
    doc.addImage(emoji, tableX + 5, startct - 15.5, 12, 12);

    const tableHeight = renderTable(doc, { body, bubbles }, tableX, startct);
    startct += tableHeight + tableGap;
  }

  // rendering AP/IB credits table
  const examCourses = userDataToExamCourses(store.state.onboardingData);
  if (examCourses.length > 0) {
    const { body, bubbles } = getCourseRows(examCourses);

    const headerHeight = rowHeight * (2 + examCourses.length);
    const estimatedHeight = estimateTableHeight(body);
    if (estimatedHeight + startct + 35 > doc.internal.pageSize.height) {
      doc.addPage();
      startct = 70;
    }

    doc.setFillColor(pdfColors.backgroundTurquoise);
    doc.roundedRect(tableX, startct - rowHeight, tableWidth, headerHeight, 4, 4, 'F');

    doc.setFont('ProximaNova-Bold', 'bold');
    doc.text('AP/IB credit', tableX + 20, startct - 6);

    renderTable(doc, { body, bubbles }, tableX, startct, APIBTableHeader);
  }

  // rendering PDF footer
  const footerY = doc.internal.pageSize.height - 25;
  const footerX =
    (doc.internal.pageSize.width - doc.getTextWidth('downloaded from courseplan.io')) / 2;
  doc.text('downloaded from ', footerX, footerY, { align: 'left' });
  doc.textWithLink('courseplan.io', footerX + doc.getTextWidth('downloaded from '), footerY, {
    url: 'https://courseplan.io',
  });
  doc.setDrawColor('#000000');
  doc.line(
    footerX + doc.getTextWidth('downloaded from '),
    footerY + 3,
    footerX + doc.getTextWidth('downloaded from courseplan.io'),
    footerY + 3
  );

  const pdfName = `${store.state.userName.firstName}_CoursePlan`;
  doc.save(pdfName);
};

// represents a coloured bubble that shows the group a requirement falls in
type bubbleData = {
  requirementGroup: string;
  color: string;
};
type semesterRows = {
  // the body of the semester table
  body: string[][];
  // the list of bubbles for each course in the semester
  bubbles: bubbleData[][];
};

const getCourseRows = (
  courses: readonly (FirestoreSemesterCourse | FirestoreSemesterPlaceholder | CourseTaken)[]
): semesterRows => {
  const rows: [string[], bubbleData[]][] = courses
    .filter(
      (course): course is FirestoreSemesterCourse | CourseTaken => !isPlaceholderCourse(course)
    )
    .map(course => {
      const [reqs, bubbles] = getFulfilledReqs(course);
      return [
        [
          `${course.code}${isCourseTaken(course) ? '' : `: ${course.name}`}`,
          course.credits.toString(),
          reqs.join('\n'),
        ],
        bubbles,
      ];
    });
  return { body: rows.map(row => row[0]), bubbles: rows.map(row => row[1]) };
};

const trimEmptySems = (sems: readonly FirestoreSemester[]): readonly FirestoreSemester[] => {
  if (sems.length === 0) return [];
  let maxNonemptyIndex = -1;
  for (let i = 0; i < sems.length; i += 1) {
    if (sems[i].courses.length > 0) maxNonemptyIndex = i;
  }
  return sems.slice(0, maxNonemptyIndex + 1);
};

const getFulfilledReqs = (
  course: FirestoreSemesterCourse | CourseTaken
): readonly [string[], bubbleData[]] => {
  let reqsFulfilled = store.state.safeRequirementFulfillmentGraph.getConnectedRequirementsFromCourse(
    { uniqueId: isCourseTaken(course) ? course.uniqueId : course.uniqueID }
  );
  reqsFulfilled = reqsFulfilled.filter(
    req => !reqsToFilterOut.includes(store.state.userRequirementsMap[req].name)
  );

  const getBubbleText = (req: string): string => {
    switch (store.state.userRequirementsMap[req].sourceType) {
      case 'College': {
        return getCollegeAbbrev(store.state.userRequirementsMap[req].sourceSpecificName);
      }
      case 'Grad':
        return 'grad';
      case 'Major':
      case 'Minor': {
        return store.state.userRequirementsMap[req].sourceSpecificName.toLowerCase();
      }
      default:
        throw new Error('group type not valid for bubble');
    }
  };

  return [
    reqsFulfilled.map(req => store.state.userRequirementsMap[req].name),
    reqsFulfilled.map(req => ({
      requirementGroup: getBubbleText(req),
      color: bubbleColorMap[store.state.userRequirementsMap[req].sourceType](req),
    })),
  ];
};

const renderBubbles = (doc: JsPDF, xPos: number, yPos: number, text: string, color: string) => {
  doc.setFillColor(color);
  const bubbleWidth = 8 + text.length * 5.5;
  doc.roundedRect(xPos, yPos, bubbleWidth, 11.5, 5.25, 5.25, 'F');
  doc.setTextColor('#ffffff');
  doc.text(text, xPos + bubbleWidth / 2, yPos + 8.5, { align: 'center' });
};

const estimateTableHeight = (body: string[][]): number => {
  const courseCharPerLine = 50;
  const headerHeight = rowHeight * 2;

  return body.reduce((sum, row) => {
    const numberOfLines = Math.max(row[0].length / courseCharPerLine, row[2].split('\n').length);
    return sum + numberOfLines * (rowFontSize + 4);
  }, headerHeight);
};

/**
 * Renders the table for a particular semester/transfer credits table.
 * Args:
 * doc: the JsPDF object,
 * semesterRows: the object containing the table body and bubble information
 * tableX: top left x co-ordinate of the table
 * tableY: top left y co-ordinate of the table
 */
const renderTable = (
  doc: JsPDF,
  rows: semesterRows,
  tableX: number,
  tableY: number,
  header: string[][] = tableHeader
): number => {
  doc.setFont('ProximaNova-Regular', 'normal');

  const { body, bubbles } = rows;
  let tableHeight = rowHeight;
  if (body.length > 0) {
    autoTable(doc, {
      head: header,
      body,
      margin: { left: tableX, bottom: 0 },
      startY: tableY,
      pageBreak: 'auto',
      tableWidth,
      theme: undefined,
      styles: {
        fontSize: rowFontSize,
        font: 'ProximaNova-Regular',
        fillColor: [255, 255, 255],
        cellPadding: { top: 2.94, bottom: 2.94, left: 5, right: 5 },
      },
      headStyles: {
        fontSize: headerFontSize,
        valign: 'middle',
        halign: 'center',
        fillColor: [255, 255, 255],
        textColor: 0,
        lineWidth: 0.5,
        font: 'ProximaNova-Bold',
        lineColor: [216, 216, 216],
      },
      columnStyles: {
        0: { cellWidth: 266 },
        1: { cellWidth: 50 },
        2: { cellWidth: 200 },
      },
      didParseCell: data => {
        data.cell.styles.lineColor = [216, 216, 216];
        data.cell.styles.lineWidth = 0.5;
      },
      willDrawCell: data => {
        doc.setFillColor('#ffffff');
        if (data.row.index === body.length - 1) {
          doc.setDrawColor('#ffffff');
          data.cell.styles.lineWidth = 0.5;
        }
      },
      /* eslint no-loop-func: "off" */
      didDrawCell: data => {
        if (data.row.index === body.length - 1) {
          doc.setDrawColor(borderGray);
          doc.setLineWidth(0.5);
          // draw middle vertical borders for last row
          if (data.column.index > 0)
            doc.line(data.cell.x, data.cell.y + data.row.height, data.cell.x, data.cell.y);
          // draw top horizontal border for last row
          doc.line(data.cell.x + data.column.width, data.cell.y, data.cell.x, data.cell.y);
        }

        tableHeight = data.cell.y + data.row.height - tableY + rowHeight;

        if (
          data.column.index === 2 &&
          data.section === 'body' &&
          data.row.index >= 0 &&
          data.row.index < body.length
        ) {
          let yPos = data.cell.y + 3;
          bubbles[data.row.index].forEach((bubble, index) => {
            const xPos =
              data.cell.x + doc.getTextWidth(body[data.row.index][2].split('\n')[index]) + 8;
            renderBubbles(doc, xPos, yPos, bubble.requirementGroup, bubble.color);
            yPos += rowFontSize + 1.5;
          });
        }
      },
    });
  }

  doc.setDrawColor(borderGray);
  doc.setLineWidth(0.5);
  doc.roundedRect(tableX, tableY - rowHeight, tableWidth, tableHeight, 4, 4);
  return tableHeight;
};

export default generatePDF;
