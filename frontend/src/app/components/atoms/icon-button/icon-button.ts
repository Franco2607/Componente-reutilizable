import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  templateUrl: './icon-button.html',
  styleUrls: ['./icon-button.scss']
})
export class IconButton {

  @Input() iconSrc: string = ''; 
  @Input() altText: string = 'Botón de acción';
  
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit(); 
  }
}