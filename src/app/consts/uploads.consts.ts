type UploadConfig = {
  chooseLabel: string;
  uploadLabel: string;
  uploadAllLabel: string;
  cancelLabel: string;
  accept: string;
  maxFileSize: number;
  fileLimit: number;
  mode: 'advanced' | 'basic' | undefined;
  invalidFileLimitMessageSummary: string;
  invalidFileLimitMessageDetail: string;
  invalidFileSizeMessageSummary: string;
  invalidFileSizeMessageDetail: string;
};

export const UploadConfig: UploadConfig = {
  chooseLabel: 'Выбрать файлы',
  uploadAllLabel: 'Загрузить все',
  uploadLabel: 'Загрузить',
  cancelLabel: 'Отмена',
  accept: '.json',
  mode: 'advanced',
  maxFileSize: 5242880, // 5 мб
  fileLimit: 5,
  invalidFileLimitMessageSummary: 'Достигнут лимит количества файлов.',
  invalidFileLimitMessageDetail: 'Максимум - {0}',
  invalidFileSizeMessageSummary: 'Достигнут лимит размера файла.',
  invalidFileSizeMessageDetail: 'Максимум - {0}',
};
