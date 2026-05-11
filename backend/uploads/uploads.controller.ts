import { 
  Controller, Post, UseInterceptors, UploadedFile, 
  ParseFilePipe, MaxFileSizeValidator, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('uploads')
export class UploadsController {

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      // 1. VALIDAMOS EL TIPO DE ARCHIVO AQUÍ (Antes de guardarlo)
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true); // Archivo aceptado
        } else {
          callback(new BadRequestException('Tipo de archivo no permitido. Solo JPG, PNG o PDF.'), false); // Archivo rechazado
        }
      },
      // 2. SI PASA LA VALIDACIÓN, LO GUARDAMOS EN DISCO
      storage: diskStorage({
        destination: './temp-uploads',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 3. VALIDAMOS EL PESO (Máximo 5MB)
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), 
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      message: 'Archivo recibido correctamente',
      fileName: file.filename
    };
  }
}