import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('CLOUD_BUCKET_NAME', '');

    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: 'https://br-se1.magaluobjects.com',
      credentials: {
        accessKeyId: this.configService.get<string>('CLOUD_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>(
          'CLOUD_ACCESS_KEY_SECRET',
          '',
        ),
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<string> {
    try {
      const fileName = `${uuidv4()}-${originalName}`;
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: ObjectCannedACL.public_read,
      };

      const response = await this.s3.send(new PutObjectCommand(uploadParams));

      if (
        !response.$metadata.httpStatusCode ||
        response.$metadata.httpStatusCode >= 300
      ) {
        throw new InternalServerErrorException('Falha no upload do arquivo');
      }

      return `https://br-se1.magaluobjects.com/${this.bucketName}/${fileName}`;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw new Error('Erro ao fazer upload do arquivo');
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    if (!fileName) {
      throw new BadRequestException('Nome do arquivo inválido');
    }

    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
        }),
      );

      return `https://br-se1.magaluobjects.com/${this.bucketName}/${fileName}`;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === 'NotFound') {
        throw new NotFoundException('Arquivo não encontrado no servidor');
      }
      console.error('Erro ao verificar existência do arquivo:', error);
      throw new Error('Erro ao buscar arquivo');
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: fileName,
      };

      const response = await this.s3.send(
        new DeleteObjectCommand(deleteParams),
      );

      if (
        !response.$metadata.httpStatusCode ||
        response.$metadata.httpStatusCode >= 300
      ) {
        throw new InternalServerErrorException('Falha ao deletar o arquivo');
      }
    } catch (error) {
      console.error('Erro ao excluir o arquivo:', error);
      throw new Error('Erro ao excluir o arquivo');
    }
  }
}
