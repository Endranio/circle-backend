import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password',
  },
});
