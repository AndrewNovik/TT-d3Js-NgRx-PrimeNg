import { createReducer, on } from '@ngrx/store';
import { initialUploadState } from './uploads.state';
import {
  uploadFiles,
  resetUploadState,
  removeUploadedFileState,
} from './uploads.actions';

export const uploadReducer = createReducer(
  initialUploadState,
  on(uploadFiles, (state, { files }) => {
    return {
      ...state,
      files: [...state.files, ...files],
      progress: 0,
      error: null,
      success: false,
    };
  }),
  on(removeUploadedFileState, (state, { file }) => ({
    ...state,
    files: [...state.files.filter((fileItem) => fileItem !== file)],
    error: null,
    progress: 0,
    success: false,
  })),
  on(resetUploadState, () => initialUploadState)
);
