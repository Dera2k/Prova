import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class UploadsService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('cloudinary.cloudName'),
      api_key: config.get<string>('cloudinary.apiKey'),
      api_secret: config.get<string>('cloudinary.apiSecret'),
    });
  }

  async upload(file: Express.Multer.File): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');

    if (!isVideo && !isImage) {
      throw new BadRequestException('Only image or video files allowed');
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: isVideo ? 'video' : 'image', folder: 'prova' },
        (error: Error | undefined, uploadResult: { secure_url: string; public_id: string } | undefined) => {
          if (error || !uploadResult) return reject(error);
          resolve(uploadResult);
        },
      );
      stream.end(file.buffer);
    });

    return { url: result.secure_url, publicId: result.public_id, type: isVideo ? 'video' : 'image' };
  }
}