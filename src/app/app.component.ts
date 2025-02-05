import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ScrollerModule } from 'primeng/scroller';
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
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  uploadFiles,
  resetUploadState,
  removeUploadedFileState,
} from './store/uploads/uploads.actions';
import { UploadState } from './store/uploads/uploads.state';
import { FormsModule } from '@angular/forms';

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
    DropdownModule,
    FormsModule,
    ScrollerModule,
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
  private readonly store$: Store<{ uploads: UploadState }> = inject(Store);

  file: File | null = null;
  selectedCountry: string | undefined;

  uploadState$: Observable<UploadState> = this.store$.select(
    (state) => state.uploads
  );

  onSelect(event: FileSelectEvent): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Данные добавлены. Удалите ненужные файлы.',
      life: 3000,
    });
  }

  choose(callback: () => void) {
    callback();
  }

  uploadEvent(callback: () => void) {
    callback();
  }

  onUpload(event: FileUploadHandlerEvent) {
    console.log(event);

    if (!event.files.length) return;

    const files: File[] = [];

    for (let file of event.files) {
      files.push(file);
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

    this.store$.dispatch(uploadFiles({ files: files }));

    this.uploader?.clear();
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Данные загружены.',
      life: 2000,
    });
  }

  removeFile(index?: number) {
    if (!index) {
      this.uploadedFiles = [];
      return;
    }
    this.uploadedFiles.splice(index, 1);
  }

  resetStore() {
    this.store$.dispatch(resetUploadState());

    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'История очищена.',
      life: 2000,
    });
  }

  removeFileFromStore(file: File) {
    this.store$.dispatch(removeUploadedFileState({ file: file }));

    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Файл удален.',
      life: 2000,
    });
  }

  selectFileFromStore(event: DropdownChangeEvent) {
    if (!event.value) return;

    let reader = new FileReader();
    reader.readAsText(event.value);
    reader.onload = () => {
      if (reader.result) {
        this.uploadedFiles.push({
          filename: event.value.name,
          data: [...(JSON.parse(reader.result as string) || null)],
        });
      } else {
        this.uploadedFiles.push({
          filename: event.value.name,
          data: null,
        });
      }
    };
  }
  show(item: any) {
    console.log(item);
  }
}
