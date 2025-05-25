import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Generates HTML template for welcome email
 * @param name - User's full name
 * @returns HTML string
 */
function generateEmailHtml(name: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to PassGo, ${name}! 🎉</h2>
      <p>Thank you for joining PassGo. We're excited to help you on your journey to getting your Passport.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>What's Next?</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li style="margin-bottom: 10px;">✅ Complete your profile</li>
          <li style="margin-bottom: 10px;">📅 Book your first appointment</li>
          <li style="margin-bottom: 10px;">📚 Check out your Application Status</li>
        </ul>
      </div>
      <p>If you have any questions, our support team is here to help!</p>
      <p>Best regards,<br>The PassGo Team</p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, name } = body;

    if (!to || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: email or name' },
        { status: 400 },
      );
    }

    console.log('Sending welcome email to:', to);
    const html = generateEmailHtml(name);

    // Send email using Gmail SMTP
    const info = await transporter.sendMail({
      from: `"PassGo Team" <${process.env.GMAIL_USER}>`,
      to: [to],
      subject: 'Welcome to PassGo Passport Services! 🎉',
      html,
      text: `Welcome to PassGo, ${name}! Thank you for joining us.`, // Plain text fallback
    });

    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json(
      { message: 'Email sent successfully', id: info.messageId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
