import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import {
  FileSelectEvent,
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { UploadConfig } from './consts';
import { ParseJsonFilePipe } from './parse-json-file.pipe';
import { UploadedFile } from './types';

import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@Component({
  selector: 'app-root',
  imports: [
    ButtonModule,
    FileUploadModule,
    CommonModule,
    ParseJsonFilePipe,
    ToastModule,
    PieChartComponent,
    BarChartComponent,
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  uploadConfig = UploadConfig;

  @ViewChild('uploader', { static: false }) uploader?: FileUpload;
  uploadedFiles: UploadedFile[] = [];

  get uploadedFilesShow(): UploadedFile[] {
    return this.uploadedFiles;
  }

  private readonly messageService: MessageService = inject(MessageService);

  onSelect(event: FileSelectEvent): void {
    console.log(event);
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Данные добавлены. Удалите ненужные файлы.',
      life: 3000,
    });
  }

  onUpload(event: FileUploadHandlerEvent) {
    console.log(event);

    for (let file of event.files) {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        if (reader.result) {
          this.uploadedFiles.push({
            filename: file.name,
            data: [...(JSON.parse(reader.result as string) || null)],
          });
        } else {
          this.uploadedFiles.push({
            filename: file.name,
            data: null,
          });
        }
      };
    }

    this.uploader?.clear();
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Данные загружены.',
      life: 3000,
    });
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }
}
