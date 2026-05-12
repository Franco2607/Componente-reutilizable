import { 
  Controller, Post, UseInterceptors, UploadedFile, 
  ParseFilePipe, MaxFileSizeValidator, BadRequestException, 
  Get, Delete, Param
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

interface FileEntry {
  uniqueName: string;
  originalName: string;
  size: string;
  mimetype: string;
}

@Controller('uploads')
export class UploadsController {
  private readonly DB_PATH = './temp-uploads/file-db.json';

  constructor() {
    if (!fs.existsSync('./temp-uploads')) fs.mkdirSync('temp-uploads')
    if (!fs.existsSync(this.DB_PATH)) fs.writeFileSync(this.DB_PATH, JSON.stringify([]))
  }

  private formatBytes(bytes: number, decimals = 2): string{
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  private saveFileToDB(entry: FileEntry) {
    const db: FileEntry[] = JSON.parse(fs.readFileSync(this.DB_PATH, 'utf8'));
    db.push(entry);
    fs.writeFileSync(this.DB_PATH, JSON.stringify(db));
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './temp-uploads',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueName}${extname(file.originalname)}`);
      },
    }),
  }))

  uploadFile( @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Archivo no recibido');

    this.saveFileToDB ({
      uniqueName: file.filename,
      originalName: file.originalname,
      size: this.formatBytes(file.size), // Guardamos el tamaño ya bonito ("120 KB")
      mimetype: file.mimetype
    });

    return {
      message: 'Archivo guardado correctamente',
      fileName: file.filename
    };
  }

  @Get('list')
  getFiles(): FileEntry[] {
    const db: FileEntry[] = JSON.parse(fs.readFileSync(this.DB_PATH, 'utf8'));
    return db;
  }

  @Delete(':filename')
  deleteFile(@Param('filename') filename: string) {
    //Se lee la bd actual
    const db: FileEntry[] = JSON.parse(fs.readFileSync(this.DB_PATH, 'utf8'))
    //Se filtra para borrar el archivo deseado
    const newDb = db.filter(f => f.uniqueName !== filename);
    
    // 3. Guardamos la nueva lista
    fs.writeFileSync(this.DB_PATH, JSON.stringify(newDb));

    // Se borra el archivo físico de la carpeta
    try {
      fs.unlinkSync(`./temp-uploads/${filename}`);
    } catch (e) {
      console.log('El archivo físico ya no existía');
    }

    return { message: 'Archivo eliminado' };
  }
}