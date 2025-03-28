# PassGo - Sri Lankan Passport Application Portal

## Overview

PassGo is a modern web application designed to streamline the Sri Lankan passport application process. It provides a user-friendly interface for submitting and validating passport applications online, making the process more efficient and accessible for Sri Lankan citizens.

## Features

- **User Authentication**

  - Secure login and registration system
  - Email validation
  - Password recovery options

- **Application Process**
  - Online passport application submission
  - Document validation
  - Real-time application status tracking
  - Secure document handling

## Tech Stack

- **Frontend Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Shadcn/ui
- **State Management**: TanStack Query
- **HTTP Client**: Axios
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- pnpm (v8 or later)

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/passgo-fe.git
cd passgo-fe
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env.local` file in the root directory and add necessary environment variables

```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

4. Start the development server

```bash
pnpm dev
```

The application will be available at `http://passgo-fe.vercel.app`

### Build for Production

```bash
pnpm build
pnpm start
```

## Development

### Code Style

The project uses ESLint and Prettier for code formatting. Format your code using:

```bash
pnpm format
```

### Linting

Run the linter with:

```bash
pnpm lint
```

## Acknowledgments

- Department of Immigration and Emigration, Sri Lanka
- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
