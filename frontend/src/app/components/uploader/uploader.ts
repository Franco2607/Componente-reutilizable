import { Component, ChangeDetectorRef } from '@angular/core';
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
    if (file) this.validateAndUpload(file);
  }

  private validateAndUpload(file: File) {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
      alert('Archivo no válido (Máximo 5MB)');
      return;
    }

    // Inicializamos estados
    this.uploadSuccess = false;
    this.uploadProgress = 0;
    this.cdr.detectChanges(); // Pintamos el inicio

    // LA ANIMACIÓN: Sube solita hasta el 90%
    const interval = setInterval(() => {
      if (this.uploadProgress !== null && this.uploadProgress < 90) {
        this.uploadProgress += 5; 
        this.cdr.detectChanges(); // Avisamos a Angular que el número subió
      }
    }, 100);

    const formData = new FormData();
    formData.append('file', file);

    // LA PETICIÓN: Aquí esperamos la respuesta del Backend
    this.http.post('http://localhost:3000/uploads', formData).subscribe({
      next: (response) => {
        // SI TODO SALE BIEN (El "Promise" se cumple)
        clearInterval(interval);   // Apagamos el cronómetro
        this.uploadProgress = 100;  // Saltamos al final
        this.cdr.detectChanges();   // Pintamos el 100%

        setTimeout(() => {
          this.uploadProgress = null; // Escondemos la barra
          this.uploadSuccess = true;  // Mostramos el mensaje verde
          this.cdr.detectChanges();

          setTimeout(() => {
            this.uploadSuccess = false;
            this.cdr.detectChanges();
          }, 3000);
        }, 600);
      },
      error: (err) => {
        clearInterval(interval);    // Apagamos el cronómetro
        this.uploadProgress = null;  // Quitamos la barra
        this.uploadSuccess = false;
        this.cdr.detectChanges();
        alert('Error en el servidor: No se pudo subir el archivo');
        console.error(err);
      }
    });
  }
}