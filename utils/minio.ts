import { Client } from 'minio';

export const minioClient = new Client({
  endPoint: '192.168.1.111',
  port: 9010,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

export const getBucketName = (inputValue?: string) => {
  const date = new Date().toISOString().split('T')[0];
  return inputValue ? `${date}-${inputValue}` : date;
};