import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FileItem {
  originalName: string;
  size: string;
  uniqueName: string;
  mimetype: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private Url = 'http://localhost:3000/uploads';

  constructor(private http: HttpClient) {}

  getFiles(): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.Url}/list`);
  }

  deleteFile(uniqueName: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/uploads/${uniqueName}`)
  }

  uploadFile(file: File): Observable <any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.Url, formData, {
      reportProgress: true,
      observe : 'events'
    });
  }
}