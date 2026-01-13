interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}
/**
 * Sends an email using Nodemailer.
 *
 * NOTE: If SMTP credentials are not configured in the environment variables,
 * this function acts as a MOCK sender and simply logs the email details to the console.
 * This prevents crashes during local development.
 */
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map