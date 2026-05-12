import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-icon',
  standalone: true,
  templateUrl: './file-icon.html',
  styleUrls: ['./file-icon.scss']
})
export class FileIcon {

  @Input() mimetype: string = '';

  get iconPath(): string {
    if (this.mimetype.includes('pdf')) return '/Icon PDF.png';
    return '/Icon PDF.png';
  }
}