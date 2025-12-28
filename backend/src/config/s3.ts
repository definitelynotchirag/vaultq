import AWS from 'aws-sdk';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials are not defined in environment variables');
}

if (!process.env.S3_BUCKET_NAME) {
  throw new Error('S3_BUCKET_NAME is not defined in environment variables');
}

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

export const S3_BUCKET = process.env.S3_BUCKET_NAME;






