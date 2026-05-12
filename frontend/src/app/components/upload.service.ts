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
  private url = 'http://localhost:3000/uploads/list';

  constructor(private http: HttpClient) {}

  getFiles(): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(this.url);
  }

  deleteFile(uniqueName: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/uploads/${uniqueName}`)
  }
}