import { Appointment } from '@/types/appointmentTypes';

interface AppointmentEmailProps {
  appointmentData: Appointment;
}

export function formatAppointmentEmail({ appointmentData }: AppointmentEmailProps) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Appointment Confirmation</h2>
      <p>Dear ${appointmentData.fullName},</p>
      
      <p>Your appointment has been successfully scheduled. Here are the details:</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Appointment Number:</strong> ${appointmentData.appointmentId}</p>
        <p><strong>Date:</strong> ${appointmentData.preferredDate}</p>
        <p><strong>Time:</strong> ${appointmentData.preferredTime}</p>
        <p><strong>Reason:</strong> ${appointmentData.reason}</p>
        <p><strong>Contact Number:</strong> ${appointmentData.contactNumber}</p>
      </div>
      
      <p>Please keep your appointment number for future reference.</p>
      
      <p>If you need to make any changes to your appointment, please contact us.</p>
      
      <p>Best regards,<br/>PassGo Team</p>
    </div>
  `;
}

interface StatusUpdateEmailProps {
  fullName: string;
  appointmentNumber: string;
  newStatus: string;
  adminNotes?: string;
  rejectionReason?: string;
}

export function formatStatusUpdateEmail({
  fullName,
  appointmentNumber,
  newStatus,
  adminNotes,
  rejectionReason,
}: StatusUpdateEmailProps) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Appointment Status Update</h2>
      <p>Dear ${fullName},</p>
      
      <p>Your appointment status has been updated.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Appointment Number:</strong> ${appointmentNumber}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        ${adminNotes ? `<p><strong>Admin Notes:</strong> ${adminNotes}</p>` : ''}
        ${rejectionReason ? `<p><strong>Reason for Rejection:</strong> ${rejectionReason}</p>` : ''}
      </div>
      
      ${
        newStatus === 'REJECTED'
          ? '<p>If you have any questions about the rejection, please feel free to contact us.</p>'
          : "<p>If you have any questions, please don't hesitate to reach out.</p>"
      }
      
      <p>Best regards,<br/>PassGo Team</p>
    </div>
  `;
}
