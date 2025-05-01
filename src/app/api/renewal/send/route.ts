import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { RenewPassportResponse, PassportDocumentType } from '@/types/passportRenewalTypes';
import { format } from 'date-fns';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function generateRenewalEmailHtml(renewal: RenewPassportResponse) {
  const formattedDOB = format(new Date(renewal.dateOfBirth), 'MMMM do, yyyy');
  const formattedExpiry = format(new Date(renewal.currentPassportExpiryDate), 'MMMM do, yyyy');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Passport Renewal Application Submitted</h2>
      <p>Dear ${renewal.fullName},</p>
      <p>Your passport renewal application has been successfully submitted. Here are your application details:</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Application Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Application ID:</strong></td>
            <td>${renewal._id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Status:</strong></td>
            <td><span style="font-weight: bold;">${renewal.status.toUpperCase()}</span></td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Current Passport Number:</strong></td>
            <td>${renewal.currentPassportNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Current Passport Expiry:</strong></td>
            <td>${formattedExpiry}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Personal Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Full Name:</strong></td>
            <td>${renewal.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Date of Birth:</strong></td>
            <td>${formattedDOB}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>NIC Number:</strong></td>
            <td>${renewal.nicNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Contact Number:</strong></td>
            <td>${renewal.contactNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Email:</strong></td>
            <td>${renewal.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Address:</strong></td>
            <td>${renewal.address}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 20px;">
        <p><strong>Uploaded Documents:</strong></p>
        <ul>
          <li>Current Passport Scan ✓</li>
          <li>NIC Front Scan ✓</li>
          <li>NIC Back Scan ✓</li>
          <li>Birth Certificate ✓</li>
          <li>Passport Photo ✓</li>
          ${renewal.documents[PassportDocumentType.ADDITIONAL_DOCS] ? '<li>Additional Documents ✓</li>' : ''}
        </ul>
      </div>

      <div style="margin-top: 20px;">
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Your application will be reviewed by our team</li>
          <li>You will receive updates about your application status via email</li>
          <li>You can track your application status on the PassGo portal</li>
        </ul>
      </div>

      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>PassGo Team</p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { renewal, recipientEmail } = body;

    if (!renewal || !recipientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: renewal or recipientEmail' },
        { status: 400 },
      );
    }

    const html = generateRenewalEmailHtml(renewal);
    const subject = `PassGo - Passport Renewal Application Submitted - ${renewal._id}`;

    const info = await transporter.sendMail({
      from: `"PassGo Team" <${process.env.GMAIL_USER}>`,
      to: [recipientEmail],
      subject,
      html,
      text: `Your passport renewal application (${renewal._id}) has been submitted successfully. You can track your application status on the PassGo portal.`,
    });

    return NextResponse.json(
      { message: 'Renewal completion email sent successfully', id: info.messageId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to send renewal completion email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
