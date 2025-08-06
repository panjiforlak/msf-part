import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { s3Config } from './s3.config';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      endpoint: s3Config.endPoint, // https://minio-bucket.motorsights.com
      region: s3Config.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<{ key: string; url: string }> {
    const key = `${folder}/${uuidv4()}${extname(file.originalname)}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
          provider: s3Config.provider,
        },
      }),
    );

    // Gunakan URL publik yang baru
    const publicUrl = 'https://minio-bucket.motorsights.com';
    return {
      key,
      url: `${publicUrl}/${s3Config.bucket}/${key}`,
    };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
      }),
    );
  }
}
