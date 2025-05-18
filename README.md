# PassGo - Passport Application Management System

PassGo is a modern web application built with Next.js 14, TypeScript, and Tailwind CSS that streamlines the passport application and management process.

## Features

### For Applicants

#### Passport Application

- **New Application Submission**
  - Step-by-step form wizard interface
  - Service type selection (Normal/One Day)
  - Travel document type selection
  - Personal information collection
  - Birth information and documentation
  - Contact details
  - Dual citizenship handling
  - Child passport application support
  - Photo upload with guidelines
  - Document uploads (NIC, Birth Certificate)
  - Collection location selection
  - Declaration and terms acceptance

#### Application Management

- **Application Tracking**
  - Real-time status updates
  - Visual timeline of application progress
  - Email notifications for status changes
  - View application details and history
  - Download submitted documents

#### Appointment System

- **Appointment Booking**
  - Schedule appointments for document verification
  - Select preferred date and time
  - Choose convenient location
  - Receive email confirmations
  - Reschedule or cancel appointments
  - View upcoming appointments

### For Administrators

#### Application Management

- **Application Processing**
  - View all applications
  - Filter and search applications
  - Update application status
  - Add admin notes
  - Process rejections with reasons
  - Track application progress
  - Send email notifications to applicants

#### Appointment Management

- **Appointment Handling**
  - View all scheduled appointments
  - Approve/reject appointment requests
  - Manage time slots availability
  - Send confirmation emails
  - Track appointment attendance

#### Document Verification

- **Document Processing**
  - Verify uploaded documents
  - Request additional documents
  - Mark documents as verified
  - Track document verification status

### System Features

#### Authentication & Security

- Secure user authentication
- Role-based access control
- Protected API routes
- Session management
- Password reset functionality

#### User Interface

- Responsive design
- Dark/Light mode support
- Loading states and animations
- Error handling and validation
- Toast notifications
- Modal confirmations

#### Email Notifications

- Application submission confirmation
- Status update notifications
- Appointment confirmations
- Document verification reminders
- Collection readiness alerts

## Technical Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Query, Zustand
- **Form Handling**: React Hook Form, Zod
- **Authentication**: JWT
- **Email Service**: Nodemailer
- **File Upload**: Multi-part form data

## Getting Started

1. **Prerequisites**

   ```bash
   Node.js 18+
   pnpm
   ```

2. **Installation**

   ```bash
   git clone <repository-url>
   cd passgo-fe
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-specific-password
   ```

4. **Development**

   ```bash
   pnpm dev
   ```

5. **Build**
   ```bash
   pnpm build
   pnpm start
   ```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # Reusable components
├── hooks/                # Custom React hooks
├── api/                  # API integration
├── types/               # TypeScript types/interfaces
├── utils/               # Utility functions
└── styles/              # Global styles
```
