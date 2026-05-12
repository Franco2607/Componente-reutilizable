import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule], // Necesario para usar *ngIf
  templateUrl: './status-badge.html',
  styleUrls: ['./status-badge.scss']
})
export class StatusBadge {
  @Input() statusType: 'completed' | 'error' | 'uploading' = 'completed';
  @Input() text: string = 'Completado';
}