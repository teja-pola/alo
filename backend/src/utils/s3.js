const AWS = require('aws-sdk');
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME } = require('../config/env');
const logger = require('./logger');

// Configure AWS
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

class S3Service {
  async uploadFile(file, folder = 'general') {
    try {
      const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      const result = await s3.upload(params).promise();
      return {
        url: result.Location,
        key: result.Key,
      };
    } catch (error) {
      logger.error('S3 upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  async uploadMultipleFiles(files, folder = 'general') {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, folder));
      return await Promise.all(uploadPromises);
    } catch (error) {
      logger.error('S3 multiple upload error:', error);
      throw new Error('Failed to upload files');
    }
  }

  async deleteFile(key) {
    try {
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
      };

      await s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      logger.error('S3 delete error:', error);
      throw new Error('Failed to delete file');
    }
  }

  async deleteMultipleFiles(keys) {
    try {
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Delete: {
          Objects: keys.map(key => ({ Key: key })),
          Quiet: false,
        },
      };

      const result = await s3.deleteObjects(params).promise();
      return result;
    } catch (error) {
      logger.error('S3 multiple delete error:', error);
      throw new Error('Failed to delete files');
    }
  }

  getSignedUrl(key, expiresIn = 3600) {
    try {
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Expires: expiresIn,
      };

      return s3.getSignedUrl('getObject', params);
    } catch (error) {
      logger.error('S3 signed URL error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }
}

module.exports = new S3Service(); 