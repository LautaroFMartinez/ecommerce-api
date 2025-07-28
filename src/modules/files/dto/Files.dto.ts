import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    description: 'Product UUID',
    example: '58be1acd-2173-4c09-ac16-1b80b3a63d65',
    format: 'uuid',
  })
  @IsUUID(4, { message: 'Product ID must be a valid UUID' })
  id: string;
}

export class FileUploadResponse {
  @ApiProperty({
    description: 'Success message',
    example: 'Image uploaded successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Uploaded image URL',
    example: 'https://cloudinary-url.com/image.jpg',
  })
  imgUrl: string;
}
