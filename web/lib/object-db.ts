import { S3Client } from '@aws-sdk/client-s3';

declare global {
   var s3Client: S3Client | undefined;
}

const s3Client =
   globalThis.s3Client ||
   new S3Client({
      forcePathStyle: true,
      endpoint: 'http://object_store:4566',
      region: 'us-east-1',
      credentials: {
         accessKeyId: 'test',
         secretAccessKey: 'test',
      },
   });
if (process.env.NODE_ENV !== 'production') globalThis.s3Client = s3Client;

export default s3Client;
