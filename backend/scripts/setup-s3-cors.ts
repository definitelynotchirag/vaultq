import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

if (!BUCKET_NAME) {
  console.error('Error: S3_BUCKET_NAME is not defined in environment variables');
  process.exit(1);
}

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3001',
  'http://localhost:3000',
].filter((origin, index, self) => self.indexOf(origin) === index);

const corsConfiguration: AWS.S3.CORSConfiguration = {
  CORSRules: [
    {
      AllowedOrigins: allowedOrigins,
      AllowedMethods: ['GET', 'POST', 'PUT', 'HEAD'],
      AllowedHeaders: ['*'],
      ExposeHeaders: ['ETag', 'x-amz-server-side-encryption', 'x-amz-request-id', 'x-amz-id-2'],
      MaxAgeSeconds: 3000,
    },
  ],
};

async function setupCORS() {
  try {
    if (!BUCKET_NAME) {
      throw new Error('S3_BUCKET_NAME is required');
    }

    console.log(`Setting up CORS configuration for bucket: ${BUCKET_NAME}`);
    console.log(`Allowed origins: ${corsConfiguration.CORSRules[0].AllowedOrigins.join(', ')}`);

    await s3.putBucketCors({
      Bucket: BUCKET_NAME,
      CORSConfiguration: corsConfiguration,
    }).promise();

    console.log('✅ CORS configuration applied successfully!');
  } catch (error: any) {
    console.error('❌ Error setting up CORS:', error.message);
    if (error.code === 'AccessDenied') {
      console.error('Make sure your AWS credentials have s3:PutBucketCORS permission');
    }
    process.exit(1);
  }
}

setupCORS();

