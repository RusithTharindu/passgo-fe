import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { ApplicationStatus } from '@/utils/statusTransitions';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function getStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.SUBMITTED:
      return '#2196F3'; // Blue
    case ApplicationStatus.PAYMENT_PENDING:
      return '#FFC107'; // Yellow
    case ApplicationStatus.PAYMENT_VERIFIED:
      return '#4CAF50'; // Green
    case ApplicationStatus.REJECTED:
      return '#F44336'; // Red
    case ApplicationStatus.COLLECTED:
      return '#4CAF50'; // Green
    default:
      return '#2196F3'; // Default Blue
  }
}

{
  /* eslint-disable @typescript-eslint/no-explicit-any */
}

function generateApplicationEmailHtml(application: any) {
  const formattedDate = application.createdAt
    ? format(new Date(application.createdAt), 'MMMM do, yyyy')
    : 'N/A';
  const statusColor = getStatusColor(application.status as ApplicationStatus);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Passport Application Update</h2>
      <p>Dear ${application.surname} ${application.otherNames},</p>
      <p>Here are your passport application details:</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Application Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Application ID:</strong></td>
            <td>${application._id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Status:</strong></td>
            <td><span style="color: ${statusColor}; font-weight: bold;">${application.status}</span></td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Submission Date:</strong></td>
            <td>${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Service Type:</strong></td>
            <td>${application.typeOfService === 'oneDay' ? 'One Day Service' : 'Normal Service'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Collection Location:</strong></td>
            <td>${application.collectionLocation || 'Not specified'}</td>
          </tr>
        </table>
      </div>

      ${
        application.adminNotes
          ? `
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Additional Notes</h3>
          <p>${application.adminNotes}</p>
        </div>
      `
          : ''
      }

      ${
        application.status === ApplicationStatus.REJECTED && application.rejectionReason
          ? `
        <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Rejection Reason</h3>
          <p>${application.rejectionReason}</p>
        </div>
      `
          : ''
      }

      <div style="margin-top: 20px;">
        <p><strong>Next Steps:</strong></p>
        ${getNextStepsHtml(application.status as ApplicationStatus)}
      </div>

      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>PassGo Team</p>
    </div>
  `;
}

function getNextStepsHtml(status: ApplicationStatus): string {
  switch (status) {
    case ApplicationStatus.SUBMITTED:
      return `
        <ul>
          <li>Your application has been received</li>
          <li>Please wait for the payment instructions</li>
          <li>You can track your application status online</li>
        </ul>
      `;
    case ApplicationStatus.PAYMENT_PENDING:
      return `
        <ul>
          <li>Please complete the payment to proceed</li>
          <li>Follow the payment instructions provided</li>
          <li>Payment verification usually takes 1-2 business days</li>
        </ul>
      `;
    case ApplicationStatus.COUNTER_VERIFICATION:
      return `
        <ul>
          <li>Please visit our office for document verification</li>
          <li>Bring all original documents</li>
          <li>Don't forget your NIC</li>
        </ul>
      `;
    case ApplicationStatus.READY_FOR_COLLECTION:
      return `
        <ul>
          <li>Your passport is ready for collection</li>
          <li>Visit the selected collection center</li>
          <li>Bring your NIC and application receipt</li>
        </ul>
      `;
    default:
      return `
        <ul>
          <li>Continue to monitor your application status</li>
          <li>We'll notify you of any updates</li>
        </ul>
      `;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { application, recipientEmail } = body;

    if (!application || !recipientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: application or recipientEmail' },
        { status: 400 },
      );
    }

    const html = generateApplicationEmailHtml(application);
    const subject = `PassGo - Passport Application ${application.status} - ${application._id}`;

    const info = await transporter.sendMail({
      from: `"PassGo Team" <${process.env.GMAIL_USER}>`,
      to: [recipientEmail],
      subject,
      html,
      text: `Your passport application (${application._id}) status has been updated to ${application.status}.`,
    });

    return NextResponse.json(
      { message: 'Application email sent successfully', id: info.messageId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to send application email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
