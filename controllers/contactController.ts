
import { Response } from 'express';
import { sendEmail } from '../utils/email';

export const handleContactForm = async (req: any, res: any) => {
  const { topic, name, email, phone, message } = req.body;

  try {
    // 1. Send email notification to Admin
    await sendEmail({
      to: 'support@cleanconnect.ng',
      subject: `New Inquiry: ${topic} - ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    // 2. Send automated acknowledgment to user
    await sendEmail({
      to: email,
      subject: 'We received your message - CleanConnect',
      text: `Hello ${name}, thank you for contacting us. We have received your message regarding "${topic}" and will get back to you shortly.`,
    });

    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
};
