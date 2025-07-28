import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { UploadImageDto, FileUploadResponse } from './dto/Files.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@ApiTags('Files')
@Controller('files')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 200 * 1024 }, // 200KB
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error('Invalid file type. Allowed: JPG, JPEG, PNG, WebP'),
            false,
          );
        }
      },
    }),
  )
  @ApiOperation({ summary: 'Upload product image' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Product UUID',
    example: 'c38b9339-c4fc-4430-ae63-5784c1143d40',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPG, JPEG, PNG, WebP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Image uploaded successfully',
        },
        imgUrl: {
          type: 'string',
          example: 'https://cloudinary-url.com/image.jpg',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Token missing or invalid' })
  @ApiBadRequestResponse({
    description: 'Invalid file type, size, or missing file',
  })
  async uploadImage(
    @Param() params: UploadImageDto,
    @UploadedFile()
    file: MulterFile,
  ): Promise<FileUploadResponse> {
    try {
      if (!file) {
        throw new BadRequestException('Image file is required');
      }
      const result = await this.filesService.uploadImage(params.id, file);
      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload image');
    }
  }
}
