import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: +process.env.SMTP_PORT,
  secure: +process.env.SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (
  to: string,
  html: string,
  subject = 'Chatio account submittion',
) => {
  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

const verify = async () => {
  await transporter.verify();
};

export default { sendMail, verify };
