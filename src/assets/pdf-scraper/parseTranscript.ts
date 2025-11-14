// Imports
import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import pdfParse from 'pdf-parse';

// Type definition for the output structure
type Transcript = {
  [semester: string]: string[]; // maps "FALL 2022" to array of course names
};

// Load PDF file
const filePath = 'src/assets/pdf-scraper/UnofficialTranscript_2023FA.pdf'; // add your transcript to the pdf-scraper folder - ignored by the .gitignore
// const dataBuffer = fs.readFileSync(filePath);
// const dataBuffer = fs.readFileSync("src/assets/pdf-scraper/UnofficialTranscript_2023FA.pdf");

// Function to parse transcript
async function extractTranscript(): Promise<Transcript> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const { text } = data;

  const lines = text.split('\n');

  const transcript: Transcript = {};
  let currentSemester: string | null = null;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect semester lines (e.g., "FALL 2022", "SPRING 2023")
    if (/^(FALL|SPRING|SUMMER)\s+\d{4}$/.test(line)) {
      currentSemester = line;
      transcript[currentSemester] = [];
    }

    // Match course lines (e.g., "CS 2800 DISCRETE STRUCTURES")
    else if (
      currentSemester &&
      /^[A-Z]{2,5}\s+\d{4}\s+/.test(line) // Course pattern: dept code + number + title
    ) {
      // Strip out grade and credit by truncating at last number
      const course = line.replace(/\d+\.\d+\s+[A-Z+\-SX]+$/, '').trim();
      transcript[currentSemester].push(course);
    }
  }

  return transcript;
}

// Run the parser
extractTranscript().then(result => {
  console.log('Transcript Courses by Semester:');
  console.log(JSON.stringify(result, null, 2));
});
