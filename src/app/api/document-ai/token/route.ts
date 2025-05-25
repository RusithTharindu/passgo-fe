import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';
import { readFileSync } from 'fs';
import { join } from 'path';

{
  /* eslint-disable @typescript-eslint/no-explicit-any */
}

// This endpoint generates an access token for Document AI
export async function GET() {
  try {
    // Load credentials from file
    const credentialsPath = join(process.cwd(), 'src/config/google-cloud-credentials.json');
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));

    // Create auth client
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    // Get access token
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    // Store in environment variable for the API endpoint to use
    process.env.GOOGLE_CLOUD_ACCESS_TOKEN = accessToken.token || '';

    // Return current time + expiration info (usually 1 hour)
    return NextResponse.json({
      success: true,
      generated: new Date().toISOString(),
      expiresIn: '1 hour',
    });
  } catch (error: any) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate token' },
      { status: 500 },
    );
  }
}
