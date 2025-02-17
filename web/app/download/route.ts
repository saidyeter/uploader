import { NextApiRequest, NextApiResponse } from 'next';
import { minioClient } from '../../utils/minio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fileId } = req.query;

  try {
    // In a real application, you would look up the file details from a database
    // where you stored the RabbitMQ message information
    const bucketName = req.query.bucket as string;
    const fileName = `${fileId}.${req.query.ext}`;

    // Generate presigned URL for download
    const url = await minioClient.presignedGetObject(
      bucketName,
      fileName,
      24 * 60 * 60 // 24 hour expiry
    );

    res.redirect(url);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}