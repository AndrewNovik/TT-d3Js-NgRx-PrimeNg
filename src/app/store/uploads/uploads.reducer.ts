import { createReducer, on } from '@ngrx/store';
import { initialUploadState } from './uploads.state';
import {
  uploadFiles,
  uploadFileSuccess,
  uploadFileFailure,
  resetUploadState,
  removeUploadedFileState,
} from './uploads.actions';

export const uploadReducer = createReducer(
  initialUploadState,
  on(uploadFiles, (state, { files }) => {
    console.log(files);
    return {
      ...state,
      files: [...state.files, ...files],
      progress: 0,
      error: null,
      success: false,
    };
  }),
  on(uploadFileSuccess, (state, { progress }) => ({
    ...state,
    progress,
    error: null,
    success: progress === 100,
  })),
  on(uploadFileFailure, (state, { error }) => ({
    ...state,
    error,
    progress: 0,
    success: false,
  })),
  on(removeUploadedFileState, (state, { file }) => ({
    ...state,
    files: [...state.files.filter((fileItem) => fileItem !== file)],
    error: null,
    progress: 0,
    success: false,
  })),
  on(resetUploadState, () => initialUploadState)
);
