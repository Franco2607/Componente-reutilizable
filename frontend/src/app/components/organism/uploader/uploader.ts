import { Component, ChangeDetectorRef, output, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uploader.html',
  styleUrls: ['./uploader.scss']
})
export class UploaderComponent {
    @Output() fileUploaded = new EventEmitter<void>();

  isDragging = false;
  uploadProgress: number | null = null;
  uploadSuccess = false;

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef // Aquí inyectamos el "avisador" de cambios
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) this.validateAndUpload(files[0]);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {this.validateAndUpload(file);
  }
  event.target.value = '';
}

  private validateAndUpload(file: File) {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
      alert('Archivo no válido (Máximo 5MB)');
      return;
    }

    this.uploadSuccess = false;
    this.uploadProgress = 0;
    this.cdr.detectChanges(); 

    const interval = setInterval(() => {
      if (this.uploadProgress !== null && this.uploadProgress < 90) {
        this.uploadProgress += 5; 
        this.cdr.detectChanges();
      }
    }, 100);

    const formData = new FormData();
    formData.append('file', file);

    this.http.post('http://localhost:3000/uploads', formData).subscribe({
      next: (response) => {
        clearInterval(interval);   
        this.uploadProgress = 100; 
        this.cdr.detectChanges();  

        this.fileUploaded.emit();

        setTimeout(() => {
          this.uploadProgress = null; 
          this.uploadSuccess = true; 
          this.cdr.detectChanges();

          setTimeout(() => {
            this.uploadSuccess = false;
            this.cdr.detectChanges();
          }, 3000);
        }, 600);
      },
      error: (err) => {
        clearInterval(interval);    
        this.uploadProgress = null;  
        this.uploadSuccess = false;
        this.cdr.detectChanges();
        alert('Error en el servidor: No se pudo subir el archivo');
        console.error(err);
      }
    });
  }
}