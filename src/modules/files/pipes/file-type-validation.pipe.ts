import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { MulterFile } from '../interfaces/multer.interface';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  transform(value: MulterFile): MulterFile {
    if (!value) {
      throw new BadRequestException('File is required');
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
      );
    }

    return value;
  }
}
