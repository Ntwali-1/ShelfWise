import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File, folder = 'shelfwise/products'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
            return;
          }
          if (!result?.secure_url) {
            reject(new Error('Cloudinary did not return a URL'));
            return;
          }
          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadFromBuffer(buffer: Buffer, folder = 'shelfwise/products'): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
              return;
            }
            if (!result?.secure_url) {
              reject(new Error('Cloudinary did not return a URL'));
              return;
            }
            resolve(result.secure_url);
          },
        )
        .end(buffer);
    });
  }
}
