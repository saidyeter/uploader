'use server'

import { publishMessage } from '@/utils/rabbitmq';
import { v4 as uuidv4 } from 'uuid';
import { getBucketName, minioClient } from '../../utils/minio';

export async function uploadFiles(formData: FormData) {
  try {
    const bucketInput = formData.get('bucketInput') as string;
    const files = formData.getAll('files') as File[];
    const bucketName = getBucketName(bucketInput);

    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName);
    }

    const uploadedFiles = [];
    for (const file of files) {
      const fileId = uuidv4();
      const fileName = `${fileId}.${file.name}`;

      const buffer = await file.arrayBuffer();
      await minioClient.putObject(bucketName, fileName, Buffer.from(buffer), file.size);

      const fileInfo = {
        fileId,
        fileName,
        bucketName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      uploadedFiles.push(fileInfo);
      await publishMessage(fileInfo);
    }

    return { success: true, files: uploadedFiles };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Error uploading files' };
  }
}