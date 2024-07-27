import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';

export function register() {
   init();
}

export async function init() {
   const s3Client = new S3Client({
      forcePathStyle: true,
      endpoint: 'http://object_store:4566',
      region: 'us-east-1',
      credentials: {
         accessKeyId: 'test',
         secretAccessKey: 'test',
      },
   });

   const corsConfiguration = {
      CORSRules: [
         {
            AllowedHeaders: ['*'],
            AllowedMethods: ['HEAD', 'GET', 'PUT', 'POST', 'DELETE'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['ETag'],
         },
      ],
   };

   const command = new PutBucketCorsCommand({
      Bucket: 'data',
      CORSConfiguration: corsConfiguration,
   });

   try {
      await s3Client.send(command);
      console.log('CORS configuration applied successfully');
   } catch (err) {
      console.error('Error applying CORS configuration', err);
   }
}
