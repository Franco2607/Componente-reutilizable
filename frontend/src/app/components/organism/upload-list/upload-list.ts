import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService, FileItem } from '../../upload.service';

@Component({
  selector: 'app-upload-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-list.html',
  styleUrls: ['./upload-list.scss']
})
export class UploadList implements OnInit {
  files: FileItem[] = [];

  constructor(
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.uploadService.getFiles().subscribe({
      next: (data: any) => {
        this.files = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al traer la lista', err)
    });
  }
  
  onDeleteFile(uniqueName: string) {
    this.uploadService.deleteFile(uniqueName).subscribe({
      next: () => {
        this.files = this.files.filter(file => file.uniqueName !== uniqueName)
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al borrar', err)
        alert('Error al borrar el archivo')
      }
  });
  }
  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return 'Icon PDF.png'
      case 'png':
        return 'Icon PNG.png';
      case 'jpg':
      case 'jpeg':
        return 'Icon JPEG.png';
      default:
        return 'Icon PDF.png';
    }
}}