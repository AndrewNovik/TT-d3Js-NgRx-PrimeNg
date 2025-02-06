export type FileData = {
  category: string;
  value: number;
};

export type UploadedFile = {
  filename: string;
  data: FileData[] | null;
};
