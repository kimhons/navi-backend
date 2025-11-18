const AWS = require('aws-sdk');

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} mimeType - MIME type
 * @returns {Promise<string>} - File URL
 */
exports.uploadFile = async (fileBuffer, fileName, mimeType) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploads/${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'public-read'
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('File upload failed');
  }
};

/**
 * Delete file from S3
 * @param {string} fileUrl - File URL
 * @returns {Promise<void>}
 */
exports.deleteFile = async (fileUrl) => {
  const key = fileUrl.split('.com/')[1];
  
  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('File deletion failed');
  }
};

/**
 * Get signed URL for private file
 * @param {string} key - S3 object key
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {string} - Signed URL
 */
exports.getSignedUrl = (key, expiresIn = 3600) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: expiresIn
  };

  return s3.getSignedUrl('getObject', params);
};

/**
 * Upload multiple files
 * @param {Array} files - Array of file objects
 * @returns {Promise<Array<string>>} - Array of file URLs
 */
exports.uploadMultipleFiles = async (files) => {
  const uploadPromises = files.map(file =>
    this.uploadFile(file.buffer, file.originalname, file.mimetype)
  );

  return Promise.all(uploadPromises);
};
