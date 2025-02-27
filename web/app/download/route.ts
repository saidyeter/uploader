import { NextRequest, NextResponse } from 'next/server';
import { minioClient } from '../../utils/minio';

// example url: http://localhost:3000/download?bucketname=2025-02-27&filename=9ae32ee6-9ca0-4fda-b4ff-2a470fdbae8f.Screenshot%202025-02-12%20at%2000.05.28.png
export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
  const params = req.url?.split('?')[1];
  if (!params) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const searchParams = new URLSearchParams(params);
  const bucketName = searchParams.get('bucketName') ?? searchParams.get('bucketname');
  const fileName = searchParams.get('fileName') ?? searchParams.get('filename');

  if (!bucketName || !fileName) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }

  try {
    // In a real application, you would look up the file details from a database
    // where you stored the RabbitMQ message information
    // const bucketName = req.query.bucket as string;
    // const fileName = `${fileId}.${req.query.ext}`;

    // Generate presigned URL for download
    const url = await minioClient.presignedGetObject(
      bucketName?.toString(),
      fileName?.toString(),
      1 * 60// one minute expiry //24 * 60 * 60 // 24 hour expiry
    );

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}