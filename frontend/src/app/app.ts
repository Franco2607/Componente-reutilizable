import { Component, signal } from '@angular/core';
import { UploaderComponent } from './components/organism/uploader/uploader';
import { UploadList } from './components/organism/upload-list/upload-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    UploaderComponent,
    UploadList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
