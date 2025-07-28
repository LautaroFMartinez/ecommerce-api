import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { CloudinaryProvider } from '../../config/cloudinary.config';
import { productsModule } from '../products/products.module';

@Module({
  imports: [productsModule],
  controllers: [FilesController],
  providers: [FilesService, CloudinaryProvider],
  exports: [FilesService],
})
export class FilesModule {}
