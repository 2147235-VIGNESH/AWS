const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");

const bucketName = "myvigbucket";
const region = "US East(N.Virginia)us-east-1";
const fileName = "file.txt";
const expirationTime = 3600; // URL expires in 1 hour

const s3Client = new S3Client({ region });

async function generateUploadURL() {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: expirationTime,
  };

  const command = new PutObjectCommand(params);
  const url = await s3Client.getSignedUrl(command);

  console.log("Upload pre-signed URL:", url);
}

async function getDownloadURL() {
  const params = { Bucket: bucketName, Key: fileName };

  const headObjectCommand = new HeadObjectCommand(params);
  const objectExists = await s3Client.headObject(headObjectCommand);

  if (objectExists) {
    const command = new GetObjectCommand(params);
    const url = await s3Client.getSignedUrl(command);

    console.log("Download pre-signed URL:", url);
  } else {
    console.error("File does not exist in the S3 bucket.");
  }
}

generateUploadURL();
getDownloadURL();
