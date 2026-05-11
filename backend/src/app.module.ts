import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadsController } from 'uploads/uploads.controller';

@Module({
  imports: [],
  controllers: [AppController, UploadsController],
  providers: [AppService],
})
export class AppModule {}
