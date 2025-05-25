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

   CLOUD_VISION_API=
   GOOGLE_CLOUD_PROJECT_ID=
   GOOGLE_CLOUD_LOCATION=
   GOOGLE_CLOUD_PROCESSOR_ID=
   GOOGLE_CLOUD_API_KEY=
   ```

4. **Development**

   ```bash
   pnpm run dev
   ```

5. **Build**
   ```bash
   pnpm run build
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

## Google Cloud Document AI OCR Integration

### Prerequisites

- Google Cloud Platform (GCP) Account
- Active Billing Account
- Google Cloud Project

### Setup Steps

1. **Create Google Cloud Project**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable billing for the project

2. **Enable Required APIs**

   ```bash
   # Enable Document AI and Cloud Resource Manager APIs
   gcloud services enable documentai.googleapis.com
   gcloud services enable cloudresourcemanager.googleapis.com
   ```

3. **Create Service Account**

   ```bash
   # Create service account
   gcloud iam service-accounts create passgo-docai-sa \
     --description="Service account for PassGo Document AI" \
     --display-name="PassGo DocAI Service Account"

   # Grant necessary permissions
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:passgo-docai-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/documentai.admin"
   ```

4. **Generate Service Account Key**

   ```bash
   gcloud iam service-accounts keys create src/config/google-cloud-credentials.json \
     --iam-account=passgo-docai-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

5. **Create Document AI Processor**

   - Go to [Document AI Processors](https://console.cloud.google.com/documentai/processors)
   - Create a new processor (recommended: FORM_PARSER or OCR)
   - Note down:
     - Project ID
     - Location
     - Processor ID

6. **Environment Configuration**
   Create a `.env.local` file with the following:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_LOCATION=your-processor-location
   GOOGLE_CLOUD_PROCESSOR_ID=your-processor-id
   GOOGLE_CLOUD_API_KEY=your-api-key
   ```

### Security Considerations

- Never commit `google-cloud-credentials.json`
- Add to `.gitignore`:
  ```
  src/config/google-cloud-credentials.json
  ```

### Troubleshooting

- Ensure service account has correct permissions
- Verify billing is enabled
- Check network connectivity
- Validate credentials file format

### Sample Credentials Structure

Create `src/config/google-cloud-credentials.json`:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email"
}
```

### Cost Estimation

- Document AI pricing varies
- Check [current pricing](https://cloud.google.com/document-ai/pricing)
- Monitor usage in Google Cloud Console

### Performance Optimization

- Implement caching mechanisms
- Use batch processing for multiple documents
- Handle rate limits gracefully

### Recommended Dependencies

```bash
pnpm add @google-cloud/documentai google-auth-library
```
