import { LoadingService } from './loading.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ErrorComponent } from 'src/app/shared/modals/error/error.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  modalRef: BsModalRef;

  constructor(
    private bsModalService: BsModalService,
    private http: HttpClient,
    private loadingService: LoadingService
    ) { }

  getApi<T>(url: string, functionName: string) {
    return this.http.get<T>(url)
      .pipe(
        tap(() => console.log(functionName)),
        catchError(error => this.handleApiError(error))
      )
  }

  postApi<T>(url: string, req: any, functionName: string) {
    return this.http.post<T>(url, req)
      .pipe(
        tap(() => console.log(functionName)),
        catchError(error => this.handleApiError(error))
      )
  }

  deleteApi<T>(url: string, functionName: string) {
    return this.http.delete<T>(url)
      .pipe(
        tap(() => console.log(functionName)),
        catchError(error => this.handleApiError(error))
      )
  }

  updateApi<T>(url: string, req: any, functionName: string) {
    return this.http.put<T>(url, req)
      .pipe(
        tap(() => console.log(functionName)),
        catchError(error => this.handleApiError(error))
      )
  }

  /** 錯誤處理 */
  handleApiError(error: any) {
    console.error('API錯誤', error);
    this.loadingService.hide();
    this.modalRef = this.bsModalService.show(ErrorComponent, {initialState: {error}})
    return throwError('發生錯誤')
  }
}
