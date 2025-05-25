import { NextResponse } from 'next/server';

{
  /* eslint-disable @typescript-eslint/no-explicit-any */
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString('base64');

    // Call Document AI API directly
    const response = await fetch(
      `https://documentai.googleapis.com/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/${process.env.GOOGLE_CLOUD_LOCATION}/processors/${process.env.GOOGLE_CLOUD_PROCESSOR_ID}:process`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GOOGLE_CLOUD_ACCESS_TOKEN}`, // You'll need to set this up
        },
        body: JSON.stringify({
          rawDocument: {
            content: base64Content,
            mimeType: file.type,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Document AI API Error:', error);
      return NextResponse.json(
        { error: error.error?.message || 'Failed to process document' },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Process and extract text from the Document AI response
    const document = data.document;
    if (!document || !document.pages) {
      return NextResponse.json({ results: [] });
    }

    const processedResults = document.pages
      .flatMap((page: any) => {
        if (!page.blocks) return [];

        return page.blocks.map((block: any) => ({
          text:
            block.layout?.textAnchor?.textSegments
              ?.map((segment: any) =>
                document.text?.substring(Number(segment.startIndex), Number(segment.endIndex)),
              )
              .join('') || '',
          confidence: Number(block.layout?.confidence) || 0,
          boundingBox: block.layout?.boundingPoly?.normalizedVertices?.map((vertex: any) => ({
            x: Number(vertex.x) || 0,
            y: Number(vertex.y) || 0,
          })),
        }));
      })
      .filter((result: any) => Boolean(result.text.trim()));

    return NextResponse.json({
      results: processedResults,
    });
  } catch (error: any) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process document' },
      { status: 500 },
    );
  }
}
