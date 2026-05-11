import { Component, signal } from '@angular/core';
import { UploaderComponent } from './components/uploader/uploader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UploaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
