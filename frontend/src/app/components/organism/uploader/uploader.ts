import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { UploadService } from '../../upload.service'; 
import { Dropzone } from '../../molecules/dropzone/dropzone';

@Component({
  selector: 'app-uploader',
  standalone : true,
  imports: [
    CommonModule,
    Dropzone
  ],
  templateUrl: './uploader.html',
  styleUrls: ['./uploader.scss']
})
export class UploaderComponent {
  progress: number = 0;
  errorMessage: string = '';
  showSuccess: boolean = false;
  private progressInterval: any;

  @Output() fileUploaded = new EventEmitter<void>();

  constructor(
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {}

  onFileReceive(file: File) {
    this.resetStatus();

    this.progressInterval = setInterval(() => {
      if (this.progress < 85) {
        this.progress += 1;
        this.cdr.detectChanges();
      }
    }, 50);

    this.uploadService.uploadFile(file).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.Response) {
          clearInterval(this.progressInterval);
          this.progress = 100;
          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.showSuccess = true;
            this.fileUploaded.emit();
            this.cdr.detectChanges();

            setTimeout(() => {
              this.resetStatus();
            }, 3000);
          }, 300);
        }
      },
      error: (err: any) => {
        clearInterval(this.progressInterval);
        this.errorMessage = 'Hubo un error al subir el archivo.';
        this.progress = 0;
        this.cdr.detectChanges();
      }
    });
  }

  private resetStatus() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.progress = 0;
    this.showSuccess = false;
    this.errorMessage = '';
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}