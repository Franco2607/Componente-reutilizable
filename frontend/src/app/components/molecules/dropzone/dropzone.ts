import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadIcon } from '../../atoms/upload-icon/upload-icon'; 

@Component({
  selector: 'app-dropzone',
  standalone: true,
  imports: [CommonModule, UploadIcon], 
  templateUrl: './dropzone.html',
  styleUrls: ['./dropzone.scss']
})
export class Dropzone {
  @Output() fileDropped = new EventEmitter<File>(); 
  isDragging = false; 
  
  private allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  private maxFileSize = 5 * 1024 * 1024;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }


  private validateAndEmit (file : File) {
    if (!this.allowedTypes.includes(file.type)) {
      alert('¡Ups! Solo se permiten archivos PDF, PNG y JPEG.');
      return
    }

    if (file.size > this.maxFileSize) {
      alert('¡Ups! El archivo es muy pesado. El límite es de 5 MB.');
      return;}

      this.fileDropped.emit(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];

    if (file) {
      this.validateAndEmit(file);
    }
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.validateAndEmit(file);
    }
    event.target.value = '';
  }
}