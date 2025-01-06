import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  from: string
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: process.env.OAUTH_ACCESS_TOKEN
  }
});

//trocar as credencias pelas da asbaf

export const sendEmail = async ({ from, to, subject, text, html }: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}: from : ${from}`, error);
    throw error; // Rethrow the error to handle it in calling functions
  }
};