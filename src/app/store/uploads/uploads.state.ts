export interface UploadState {
  files: File[] | [];
  progress: number;
  error: string | null;
  success: boolean;
}

export const initialUploadState: UploadState = {
  files: [],
  progress: 0,
  error: null,
  success: false,
};
