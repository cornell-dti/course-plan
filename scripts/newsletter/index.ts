/* eslint-disable no-await-in-loop */
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { config } from 'dotenv';
import { readFile } from 'fs/promises';
import { semestersCollection } from '../firebase-config';

config({ path: './.env.local' });

const auth = {
  type: 'OAuth2',
  user: 'courseplan.io@gmail.com',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailOptions = {
  from: 'CoursePlan <courseplan.io@gmail.com>',
  subject: 'CoursePlan Newsletter',
};

const sourcePath = './src/assets/newsletters/sp23.html';

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

/** A helper function to generate a wait promise. Used for cooldown to limit API usage. */
const wait = (time: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), time);
  });

const sendToUsers = async (...users: readonly string[]) => {
  const accessToken = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { ...auth, accessToken },
  });
  const html = await readFile(sourcePath);
  for (const to of users) {
    await transport.sendMail({ ...mailOptions, html, to });
    // To avoid exceeding Google's rate limit
    await wait(500);
  }
};

const sendNewsletter = async () => {
  const collection = await semestersCollection.get();
  await sendToUsers(...collection.docs.map(({ id }) => id));
};

/**
 * The newsletter will be sent to each email provided as a command line argument.
 * If no command line arguments are provided, it will send the newsletter to
 * every user in the database. Put your credentials in a .env.local file
 * in the root of the project for this to work.
 */
const main = async () => {
  if (process.argv.length > 1) {
    await sendToUsers(...process.argv.slice(2));
  } else {
    await sendNewsletter();
  }
};

main();
