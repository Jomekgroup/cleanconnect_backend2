"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configuration for the email transporter
// Ensure these variables are set in your .env file for production
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
    },
});
/**
 * Sends an email using Nodemailer.
 *
 * NOTE: If SMTP credentials are not configured in the environment variables,
 * this function acts as a MOCK sender and simply logs the email details to the console.
 * This prevents crashes during local development.
 */
const sendEmail = async (options) => {
    // Check if we are running in a dev environment without real SMTP creds
    const isMock = !process.env.SMTP_HOST || process.env.SMTP_HOST === 'smtp.example.com';
    if (isMock) {
        console.log('==================================================');
        console.log(' 📧 [MOCK EMAIL SENDER] (No SMTP Configured)');
        console.log(` To:      ${options.to}`);
        console.log(` Subject: ${options.subject}`);
        console.log(` Body:    ${options.text}`);
        console.log('==================================================');
        return;
    }
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.FROM_NAME || 'CleanConnect'}" <${process.env.FROM_EMAIL || 'no-reply@cleanconnect.ng'}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        console.log(`Email sent: ${info.messageId}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
        // In a critical production system, you might want to re-throw or log to a monitoring service
        throw new Error('Email could not be sent');
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map