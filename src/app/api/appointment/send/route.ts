import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Appointment, AppointmentStatus } from '@/types/appointmentTypes';
import { format } from 'date-fns';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function getStatusColor(status: AppointmentStatus): string {
  switch (status) {
    case AppointmentStatus.APPROVED:
      return '#4CAF50';
    case AppointmentStatus.PENDING:
      return '#FFC107';
    case AppointmentStatus.REJECTED:
      return '#F44336';
    case AppointmentStatus.CANCELLED:
      return '#9E9E9E';
    case AppointmentStatus.COMPLETED:
      return '#2196F3';
    default:
      return '#000000';
  }
}

function generateAppointmentEmailHtml(appointment: Appointment) {
  const formattedDate = format(new Date(appointment.preferredDate), 'MMMM do, yyyy');
  const statusColor = getStatusColor(appointment.status);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Passport Appointment Details</h2>
      <p>Dear ${appointment.fullName},</p>
      <p>Here are your appointment details:</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Appointment Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Appointment ID:</strong></td>
            <td>${appointment.appointmentId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Status:</strong></td>
            <td><span style="color: ${statusColor}; font-weight: bold;">${appointment.status.toUpperCase()}</span></td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Date:</strong></td>
            <td>${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Time:</strong></td>
            <td>${appointment.preferredTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Location:</strong></td>
            <td>${appointment.preferredLocation}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Personal Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Full Name:</strong></td>
            <td>${appointment.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>NIC Number:</strong></td>
            <td>${appointment.nicNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Contact Number:</strong></td>
            <td>${appointment.contactNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Address:</strong></td>
            <td>${appointment.permanentAddress}</td>
          </tr>
        </table>
      </div>

      ${
        appointment.adminNotes
          ? `
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Additional Notes</h3>
          <p>${appointment.adminNotes}</p>
        </div>
      `
          : ''
      }

      ${
        appointment.status === AppointmentStatus.REJECTED && appointment.rejectionReason
          ? `
        <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Rejection Reason</h3>
          <p>${appointment.rejectionReason}</p>
        </div>
      `
          : ''
      }

      <div style="margin-top: 20px;">
        <p><strong>Important Notes:</strong></p>
        <ul>
          <li>Please arrive 15 minutes before your scheduled time.</li>
          <li>Bring your NIC and all required documents.</li>
          <li>If you need to reschedule, please do so at least 24 hours in advance.</li>
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
    const { appointment, recipientEmail } = body;

    if (!appointment || !recipientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: appointment or recipientEmail' },
        { status: 400 },
      );
    }

    const html = generateAppointmentEmailHtml(appointment);
    const subject = `PassGo - Appointment ${appointment.status === AppointmentStatus.APPROVED ? 'Confirmed' : 'Updated'} - ${appointment.appointmentId}`;

    const info = await transporter.sendMail({
      from: `"PassGo Team" <${process.env.GMAIL_USER}>`,
      to: [recipientEmail],
      subject,
      html,
      text: `Your passport appointment (${appointment.appointmentId}) has been ${appointment.status}. Date: ${appointment.preferredDate}, Time: ${appointment.preferredTime}, Location: ${appointment.preferredLocation}`,
    });

    return NextResponse.json(
      { message: 'Appointment email sent successfully', id: info.messageId },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to send appointment email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
