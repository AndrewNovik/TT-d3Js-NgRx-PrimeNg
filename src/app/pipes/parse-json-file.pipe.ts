import { ChangeDetectorRef, inject, Pipe, PipeTransform } from '@angular/core';
import { UploadedFile } from '../types/uploads.types';

@Pipe({
  name: 'parseJsonFile',
  pure: false,
})
export class ParseJsonFilePipe implements PipeTransform {
  file: UploadedFile | null = null;

  private readonly cd = inject(ChangeDetectorRef);

  transform(value: File): UploadedFile | null {
    if (!this.file) {
      let reader = new FileReader();
      reader.readAsText(value);
      reader.onload = () => {
        if (reader.result) {
          this.file = {
            filename: value.name,
            data: [...(JSON.parse(reader.result as string) || null)],
          };
        } else {
          this.file = {
            filename: value.name,
            data: null,
          };
        }

        // reader.onLoad - ассинхронная функция
        this.cd.markForCheck();
      };
    }

    return this.file;
  }
}
