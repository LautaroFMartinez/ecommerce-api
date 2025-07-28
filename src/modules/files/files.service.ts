import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ProductsRepository } from '../products/products.repository';
import { FileUploadResponse } from './dto/Files.dto';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class FilesService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async uploadImage(
    productId: string,
    file: MulterFile,
  ): Promise<FileUploadResponse> {
    const product = await this.productsRepository.getProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    try {
      interface CloudinaryUploadResult {
        secure_url: string;
        [key: string]: any;
      }

      const uploadResult: CloudinaryUploadResult = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: 'image',
                folder: 'ecommerce-products',
                public_id: `product_${productId}_${Date.now()}`,
              },
              (error, result) => {
                if (error) {
                  reject(
                    new Error(`Cloudinary upload failed: ${error.message}`),
                  );
                } else {
                  resolve(result as CloudinaryUploadResult);
                }
              },
            )
            .end(file.buffer);
        },
      );

      const imgUrl: string = uploadResult.secure_url;

      await this.updateProductImage(productId, imgUrl);

      return {
        message: 'Image uploaded successfully',
        imgUrl,
      };
    } catch (error) {
      throw new Error('Failed to upload image to Cloudinary', { cause: error });
    }
  }

  private async updateProductImage(
    productId: string,
    imgUrl: string,
  ): Promise<void> {
    const updated = await this.productsRepository.updateProductImage(
      productId,
      imgUrl,
    );
    if (!updated) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }
}
