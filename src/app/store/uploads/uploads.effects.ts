import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { uploadFiles } from './uploads.actions';

@Injectable()
export class UploadEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}
}
