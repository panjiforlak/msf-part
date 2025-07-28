import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  async sendEmail(to: string, subject: string, text: string) {
    console.log('Creating SMTP transporter...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      console.log('Verifying SMTP connection...');
      await transporter.verify();
      console.log('SMTP connection verified successfully.');

      await transporter.sendMail({
        from: '"No Reply" <noreply@yourapp.com>',
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error('Send mail error:', error);
      throw error;
    }
  }
}
