import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { ScrollerModule } from 'primeng/scroller';
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadModule,
} from 'primeng/fileupload';
import { UploadConfig } from './consts/uploads.consts';
import { ParseJsonFilePipe } from './pipes/parse-json-file.pipe';
import { UploadedFile } from './types/uploads.types';

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
    MessagesModule,
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('uploader', { static: false }) uploader?: FileUpload;

  private readonly messageService: MessageService = inject(MessageService);
  private readonly store$: Store<{ uploads: UploadState }> = inject(Store);
  private readonly cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  public uploadState$: Observable<UploadState> = this.store$.select(
    (state) => state.uploads
  );
  public uploadedFiles: UploadedFile[] = [];
  public uploadConfig = UploadConfig;

  get uploadedFilesShow(): UploadedFile[] {
    return this.uploadedFiles;
  }

  onSelect(): void {
    // Столкнулся с проблемой, что невозможно убрать отображение всплывающих уведомлений о валидации лимита загружаемых файлов.
    // https://github.com/primefaces/primeng/issues/13606 - свежий запрос от других разработчиков. Проблему не решают
    // Т.е. если валидация на загрузку 5 файлов, а ты например загрузил 7 файлов, появится уведомление, удалили один, добавится еще одно уведомление,
    // их компится бесконечное количество. Были комиты от разработчиков, что они забыли хук на remove - https://github.com/primefaces/primeng/pull/11834/files
    // видимо, это не покрывает все случаи. И пришлось писать "костыль". И еще p-progressbar устанавливается по умолчанию и его тоже никак не убрать.

    // хук onSelect вызовет валидацию на количество файлов , но в ходе тестов понял, что
    // рендер уведомлений и прогресс-бара случится позже, поэтому обнаруживаем изменения

    this.cd.detectChanges();

    // и только после этого обращаюсь к коллекции, где будут созданы эти блоки
    const uploaderChildBlocks = this.uploader?.content?.nativeElement
      .children as HTMLCollection;

    for (let block of uploaderChildBlocks) {
      // пока удаляем только прогресс-бар
      if (block.tagName === 'P-PROGRESSBAR') {
        block.remove();
      }
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Данные добавлены. Удалите ненужные файлы.',
      life: 2000,
    });
  }

  onUploadToStore(event: FileUploadHandlerEvent) {
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

  removeFileFromTemplate(index?: number) {
    if (index !== 0 && !index) {
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

  deleteExtraMessageInstances() {
    const uploaderChildBlocks = this.uploader?.content?.nativeElement
      .children as HTMLCollection;

    for (let block of uploaderChildBlocks) {
      // теперь удаляем и меседжи
      if (block.tagName === 'P-MESSAGE') {
        block.remove();
      }
    }

    // после этого хука все равно будет валидация количества файлов и 1 экземпляр сообщения в таком случае создастся.
    // таким образом я решил бесконечную отрисовку новых сообщений о валидации.
  }
}
