import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { MulterFile } from '../interfaces/multer.interface';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSize = 200 * 1024; // 200KB

  transform(value: MulterFile): MulterFile {
    if (!value) {
      throw new BadRequestException('File is required');
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `File size must be less than ${this.maxSize / 1024}KB`,
      );
    }

    return value;
  }
}
