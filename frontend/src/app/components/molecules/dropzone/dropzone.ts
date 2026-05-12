import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadIcon } from '../../atoms/upload-icon/upload-icon'; // Tu átomo

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

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.fileDropped.emit(file);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileDropped.emit(file);
    }
    event.target.value = '';
  }
}