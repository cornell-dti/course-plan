import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import url from '@/assets/cp-logo-pdf.png';
import fallEmojiURL from '@/assets/images/pdf-gen/fall.png';
import springEmojiURL from '@/assets/images/pdf-gen/spring.png';
import summerEmojiURL from '@/assets/images/pdf-gen/summer.png';
import winterEmojiURL from '@/assets/images/pdf-gen/winter.png';
import APIBEmojiURL from '@/assets/images/pdf-gen/apib.png';
import { lightPlaceholderGray, borderGray } from '@/assets/constants/scss-variables';
import { pdfColors } from '@/assets/constants/colors';
import { bubbleColorMap, loadImage, getCourseRowsWithForcedReqs } from './utilities';
import { SemesterRows } from './types';

import {
  getCollegeFullName,
  getMajorFullName,
  getMinorFullName,
  getGradFullName,
} from '../../utilities';
import store from '../../store';
import { addFonts } from './add-fonts';
import Requirement from '@/schedule-generator/requirement';

const rowHeight = 18;
const tableWidth = 516;
// vertical space between tables for two semesters
const tableGap = 20;
// starting y co-ordinate of the first table
const firstPageFirstTableY = 90;
const secondPageFirstTableY = 170;

const rowFontSize = 10.5;
const headerFontSize = 10.5;
const lineSpacing = 1.5;
const headerLinesGap = 7;

const tableHeader = [['Course', 'Credits', 'Requirements Fulfilled']];

// max number of characters that can fit into a line for the major, minor or grad program field
const programLineCharLimit = 45;

/**
 * Generates a PDF of the schedule for the given classes.
 *
 * @param classes class objects containing information about some class that fulfilles some requirement.
 *                Currently has a believed edge case in that it can only handle one course per requirement.
 * @param calendarDataString the base64 encoded string of the calendar image
 * @param year the year of the generated semester schedule
 * @param season the season of the generated semester schedule
 */
const generateSchedulePDF = async (
  classes: {
    fulfilledReq: Requirement | undefined;
    title: string | undefined;
    credits: number;
    color: string;
    code: string;
    timeStart: string | undefined;
    timeEnd: string | undefined;
  }[],
  calendarDataString: string,
  year: number,
  season: FirestoreSemesterSeason
): Promise<void> => {
  const doc = new JsPDF({ unit: 'pt', format: 'letter' });

  addFonts(doc);
  doc.setFont('ProximaNova-Regular', 'normal');

  const tableX = (doc.internal.pageSize.width - tableWidth) / 2;
  let programY = 110;

  // render PDF header for page 1
  await renderFirstHeader(doc);

  // Rendering table now
  const tableHeight = await renderBaseTable(doc, classes, year, season, programY, tableX);

  // Calendar time
  const imgProps = doc.getImageProperties(calendarDataString);

  doc.addImage(
    calendarDataString,
    'PNG',
    48,
    tableHeight,
    tableWidth,
    imgProps.height * (tableWidth / imgProps.width)
  );

  renderFooter(doc);

  // create new page
  doc.addPage();

  doc.setPage(2);

  // rendering PDF header for page 2
  programY = await renderSecondHeader(doc);

  // Rendering tables now
  await renderBaseTable(doc, classes, year, season, programY, tableX, 'right');

  // rendering PDF footer
  renderFooter(doc);

  const pdfName = `${store.state.userName.firstName}_Generated_Schedule`;
  doc.save(pdfName);
};

/**
 * Renders the first header of the PDF.
 *
 * @param doc the JsPDF object
 */
const renderFirstHeader = async (doc: JsPDF): Promise<void> => {
  const img = await loadImage(url);
  doc.addImage(img, 'PNG', 48, 30, 84, 23.25);

  doc.setFontSize(headerFontSize);

  const nameText = 'Name:';
  const collegeText = 'College:';

  doc.text(nameText, 354, 36 + 1.75);
  doc.text(collegeText, 354, 53.2 + 0.25);

  doc.setTextColor(lightPlaceholderGray);

  doc.text(
    `${store.state.userName.firstName} ${
      store.state.userName.middleName ? `${store.state.userName.middleName} ` : ''
    }${store.state.userName.lastName}`,
    408,
    36 + 1.75
  );
  doc.text(getCollegeFullName(store.state.onboardingData.college), 408, 53.2 + 0.25);

  doc.setTextColor('#000000');
};

/**
 * Renders the second header of the PDF. This includes the program information.
 *
 * @param doc the JsPDF object
 * @returns the y co-ordinate of the last program line
 */
const renderSecondHeader = async (doc: JsPDF): Promise<number> => {
  const img = await loadImage(url);
  doc.addImage(img, 'PNG', 48, 30, 84, 23.25);

  doc.setFontSize(headerFontSize);

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

    const [gradProgram, textHeight] = truncatePrograms([
      getGradFullName(store.state.onboardingData.grad),
    ]);
    doc.text(gradProgram, 100.3, programY);
    programY += textHeight;
  }

  if (store.state.onboardingData.major.length > 0) {
    doc.setTextColor('#000000');
    doc.text('Major:', 48, programY);
    doc.setTextColor(lightPlaceholderGray);

    const [majors, textHeight] = truncatePrograms(
      store.state.onboardingData.major.map(major => getMajorFullName(major))
    );
    doc.text(majors, 100.3, programY);
    programY += textHeight;
  }

  if (store.state.onboardingData.minor.length > 0) {
    doc.setTextColor('#000000');
    doc.text('Minor:', 48, programY);
    doc.setTextColor(lightPlaceholderGray);

    const [minors, textHeight] = truncatePrograms(
      store.state.onboardingData.minor.map(minor => getMinorFullName(minor))
    );
    doc.text(minors, 100.3, programY);
    programY += textHeight;
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

  return programY;
};

/**
 * Renders the base table for a semester. Please note that this function is modelled off
 * of src/tools/export-plan/pdf-generator.ts, as are many others in this file.
 *
 * @param doc the JsPDF object
 * @param classes courses being used to fulfill requirements
 * @param year the year of the generated semester schedule
 * @param season the season of the generated semester schedule
 * @param programY the y co-ordinate of the last program line
 * @param tableX the x co-ordinate of the table
 * @param totalCreditsAlignment the alignment of the total credits text
 * @returns the y co-ordinate of the last table line
 */
const renderBaseTable = async (
  doc: JsPDF,
  classes: {
    title: string | undefined;
    credits: number;
    color: string;
    code: string;
    fulfilledReq: Requirement | undefined;
    timeStart: string | undefined;
    timeEnd: string | undefined;
  }[],
  year: number,
  season: FirestoreSemesterSeason,
  programY: number,
  tableX: number,
  totalCreditsAlignment: 'left' | 'right' = 'left'
): Promise<number> => {
  let startct = 0;

  if (totalCreditsAlignment === 'left') {
    // on the first page
    startct = firstPageFirstTableY;
  } else {
    startct = Math.max(secondPageFirstTableY, programY + 20);
  }

  const emojiMap = {
    Fall: await loadImage(fallEmojiURL),
    Spring: await loadImage(springEmojiURL),
    Summer: await loadImage(summerEmojiURL),
    Winter: await loadImage(winterEmojiURL),
    APIB: await loadImage(APIBEmojiURL),
  };

  let headerHeight = rowHeight * (2 + classes.length);
  if (classes.length === 0) headerHeight = rowHeight;

  const { body, bubbles } = getCourseRowsWithForcedReqs(classes);

  const estimatedHeight = estimateTableHeight(body);
  if (estimatedHeight + startct + 35 > doc.internal.pageSize.height) {
    doc.addPage();
    startct = 70;
  }

  doc.setFillColor(pdfColors.backgroundTurquoise);
  doc.roundedRect(tableX, startct - rowHeight, tableWidth, headerHeight, 4, 4, 'F');

  doc.setFont('ProximaNova-Bold', 'bold');
  doc.text(`${season} ${year} Generated Schedule`, tableX + 20, startct - 6);

  const emoji = emojiMap[season];
  doc.addImage(emoji, tableX + 5, startct - 15.5, 12, 12);

  const tableHeight = renderTable(doc, { body, bubbles }, tableX, startct, totalCreditsAlignment);
  startct += tableHeight + tableGap;

  return startct;
};

/*
 * Renders the footer of the PDF, containing the courseplan.io link.
 *
 * @param doc the JsPDF object
 */
const renderFooter = (doc: JsPDF): void => {
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
};

/**
 * Renders a bubble at a given position, used for displaying requirement groups.
 *
 * @param doc the JsPDF object
 * @param xPos the x co-ordinate of the bubble
 * @param yPos the y co-ordinate of the bubble
 * @param text the text to display in the bubble
 * @param color the color of the bubble
 */
const renderBubbles = (doc: JsPDF, xPos: number, yPos: number, text: string, color: string) => {
  doc.setFillColor(color);
  const bubbleWidth = 8 + text.length * 5.5;
  doc.roundedRect(xPos, yPos, bubbleWidth, 11.5, 5.25, 5.25, 'F');
  doc.setTextColor('#ffffff');
  doc.text(text, xPos + bubbleWidth / 2, yPos + 8.5, { align: 'center' });
};

/**
 * Estimates the height in pixels of a table of classes.
 *
 * @param body the body of the table
 * @returns the estimated height of the table
 */
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
 *
 * FIXME: right now there is an overflow issue (in `pdf-generator.ts` as well) if
 * the requirement name *and* requirement code are too long. i.e. the little bubble that shows
 * the requirement group may overflow past the right edge of the table.
 *
 * Generally doesn't happen; only occurs with long requirement names like for InfoSci.
 */
const renderTable = (
  doc: JsPDF,
  rows: SemesterRows,
  tableX: number,
  tableY: number,
  totalCreditsAlignment: 'left' | 'right' = 'left',
  header: string[][] = tableHeader
): number => {
  doc.setFont('ProximaNova-Regular', 'normal');

  const { body, bubbles } = rows;
  let tableHeight = rowHeight;

  // Calculate total credits.
  const totalCredits = body.reduce((sum, row) => sum + parseFloat(row[1]), 0);

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
        halign: 'left',
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

  doc.text(
    `Total Credits: ${totalCredits}`,
    totalCreditsAlignment === 'right' ? tableX + tableWidth : tableX,
    tableY + tableHeight,
    {
      align: totalCreditsAlignment,
    }
  );
  doc.setDrawColor(borderGray);
  doc.setLineWidth(0.5);
  doc.roundedRect(tableX, tableY - rowHeight, tableWidth, tableHeight, 4, 4);
  return tableHeight;
};

/**
 * Given a list of program names
 * @returns a pair with
 * 1) string consisting of several lines, each no more than the maximum character
 * limit needed.
 * 2) the height of the string when rendered
 */
const truncatePrograms = (programs: string[]): [string, number] => {
  const lines: string[] = [];
  let currentLine = '';

  programs
    // trimming identifiers like [before fall 2020]
    .map(program => {
      const cropIndex = program.lastIndexOf('[');
      return cropIndex === -1 ? program : program.slice(0, cropIndex).trim();
    })
    // policy: if a program would overflow current line, we push the whole program
    // to a new line.
    .forEach(program => {
      if (program.length > programLineCharLimit) {
        if (currentLine !== '') lines.push(currentLine);
        const programOverflowPos = program.lastIndexOf(' ', programLineCharLimit);
        lines.push(program.slice(0, programOverflowPos));
        currentLine = `${program.slice(programOverflowPos)}, `;
      } else if (currentLine.length + program.length > programLineCharLimit) {
        lines.push(currentLine);
        currentLine = `${program}, `;
      } else {
        currentLine += `${program}, `;
      }
    });
  lines.push(currentLine);

  // joining with a newline, and removing trailing comma
  return [
    lines.join('\n').replace(/,\s*$/, ''),
    headerLinesGap + lines.length * headerFontSize + (lines.length - 1) * lineSpacing,
  ];
};
export default generateSchedulePDF;
