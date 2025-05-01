import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { RenewPassportResponse, RenewPassportStatus } from '@/types/passportRenewalTypes';
import { format } from 'date-fns';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function getStatusColor(status: RenewPassportStatus): string {
  switch (status) {
    case RenewPassportStatus.VERIFIED:
      return '#4CAF50';
    case RenewPassportStatus.PENDING:
      return '#FFC107';
    case RenewPassportStatus.REJECTED:
      return '#F44336';
    case RenewPassportStatus.READY_TO_COLLECT:
      return '#2196F3';
    default:
      return '#000000';
  }
}

function generateCollectionInstructions() {
  return `
    <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; border: 2px solid #4CAF50;">
      <h3 style="margin-top: 0; color: #2E7D32;">Important Collection Instructions</h3>
      <p style="margin: 10px 0;"><strong>Please bring the following documents when collecting your passport:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li><strong>Original copies of all submitted documents</strong></li>
        <li><strong>Photocopies of all submitted documents</strong></li>
      </ul>
      <p style="margin: 10px 0;"><strong>Additional Requirements for Name Changes:</strong></p>
      <p style="margin: 10px 0; color: #1B5E20;">
        <strong>If you have changed your name after marriage, you must also bring:</strong>
      </p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li><strong>Original marriage certificate</strong></li>
        <li><strong>Photocopy of marriage certificate</strong></li>
      </ul>
      <p style="margin: 10px 0; color: #B71C1C;">
        <strong>Note: All documents will be reviewed at the time of collection.</strong>
      </p>
    </div>
  `;
}

function generateRenewalEmailHtml(renewal: RenewPassportResponse) {
  const formattedDate = format(new Date(renewal.createdAt), 'MMMM do, yyyy');
  const statusUpdateTime = format(new Date(renewal.updatedAt), 'MMMM do, yyyy hh:mm aa');
  const statusColor = getStatusColor(renewal.status);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; text-align: center; margin-bottom: 30px;">
        Passport Renewal Request Update
      </h2>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">Request Details</h3>
        <p style="margin: 5px 0;">Request ID: ${renewal._id}</p>
        <p style="margin: 5px 0;">Submitted on: ${formattedDate}</p>
        <p style="margin: 5px 0;">
          Status: <span style="color: ${statusColor}; font-weight: bold;">
            ${renewal.status}
          </span>
          <br/>
          <span style="font-size: 0.9em; color: #666;">
            Updated on: ${statusUpdateTime}
          </span>
        </p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #333;">Applicant Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Name:</strong></td>
            <td>${renewal.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>NIC Number:</strong></td>
            <td>${renewal.nicNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Passport Number:</strong></td>
            <td>${renewal.currentPassportNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Passport Expiry:</strong></td>
            <td>${format(new Date(renewal.currentPassportExpiryDate), 'MMMM do, yyyy')}</td>
          </tr>
        </table>
      </div>

      ${renewal.status === RenewPassportStatus.READY_TO_COLLECT ? generateCollectionInstructions() : ''}

      ${
        renewal.adminRemarks
          ? `
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Additional Notes</h3>
          <p>${renewal.adminRemarks}</p>
        </div>
      `
          : ''
      }

      <div style="margin-top: 20px;">
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>PassGo Team</p>
      </div>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { renewal, recipientEmail } = body;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      subject: `Passport Renewal Request Update - ${renewal._id}`,
      html: generateRenewalEmailHtml(renewal),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
