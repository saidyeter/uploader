import { Client } from 'minio';

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!
});

export const getBucketName = (inputValue?: string) => {
  const date = new Date().toISOString().split('T')[0];
  return inputValue ? `${date}-${inputValue}` : date;
};