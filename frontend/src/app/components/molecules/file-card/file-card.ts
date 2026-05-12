import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileIcon } from '../../atoms/file-icon/file-icon';
import { StatusBadge } from '../../atoms/Icon-complete/status-badge';
import { IconButton } from '../../atoms/icon-button/icon-button';
import { FileItem } from '../../../components/upload.service';

@Component({
  selector: 'app-file-card',
  standalone: true,
  imports: [CommonModule, FileIcon, StatusBadge, IconButton],
  templateUrl: './file-card.html',
  styleUrls: ['./file-card.scss']
})
export class FileCardComponent {

  @Input() file!: FileItem; 
  
  @Output() delete = new EventEmitter<string>(); 

  onDeleteClick() {
    this.delete.emit(this.file.uniqueName); 
  }
}