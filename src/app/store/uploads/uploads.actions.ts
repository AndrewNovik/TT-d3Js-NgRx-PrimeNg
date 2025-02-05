import { createAction, props } from '@ngrx/store';

export const uploadFiles = createAction(
  '[Upload] Upload File',
  props<{ files: File[] }>()
);

export const uploadFileSuccess = createAction(
  '[Upload] Upload File Success',
  props<{ progress: number }>()
);

export const uploadFileFailure = createAction(
  '[Upload] Upload File Failure',
  props<{ error: string }>()
);

export const removeUploadedFileState = createAction(
  '[Upload] Remove File From Sore',
  props<{ file: File }>()
);

export const resetUploadState = createAction('[Upload] Reset Upload State');
