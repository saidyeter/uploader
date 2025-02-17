'use server'

import { minioClient } from '../../utils/minio';

export interface FileItem {
  name: string;
  size: number;
  lastModified: string;
  bucketName: string;
}

export async function getBuckets() {
  try {
    const buckets = await minioClient.listBuckets();
    return { 
      success: true, 
      buckets: buckets.map(b => ({
        name: b.name,
        creationDate: b.creationDate
      }))
    };
  } catch (error) {
    console.error('Error loading buckets:', error);
    return { success: false, error: 'Failed to load buckets' };
  }
}

export async function getBucketFiles(bucketName: string) {
  try {
    const stream = minioClient.listObjects(bucketName, '', true);
    const files: FileItem[] = [];
    
    for await (const file of stream) {
      files.push({
        name: file.name,
        size: file.size,
        lastModified: file.lastModified.toISOString(),
        bucketName
      });
    }

    return { success: true, files };
  } catch (error) {
    console.error('Error loading bucket files:', error);
    return { success: false, error: 'Failed to load bucket files' };
  }
}

export async function getFiles() {
  try {
    const buckets = await minioClient.listBuckets();
    const allFiles: FileItem[] = [];

    for (const bucket of buckets) {
      const stream = minioClient.listObjects(bucket.name, '', true);
      for await (const file of stream) {
        allFiles.push({
          name: file.name,
          size: file.size,
          lastModified: file.lastModified.toISOString(),
          bucketName: bucket.name
        });
      }
    }

    return { success: true, files: allFiles };
  } catch (error) {
    console.error('Error loading files:', error);
    return { success: false, error: 'Failed to load files' };
  }
}

export async function deleteFile(bucketName: string, fileName: string) {
  try {
    await minioClient.removeObject(bucketName, fileName);
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete file' };
  }
}

export async function getDownloadUrl(bucketName: string, fileName: string) {
  try {
    const url = await minioClient.presignedGetObject(bucketName, fileName, 24 * 60 * 60);
    return { success: true, url };
  } catch (error) {
    console.error('Download error:', error);
    return { success: false, error: 'Failed to generate download URL' };
  }
}