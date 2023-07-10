import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { catchError, exhaustMap, tap, take } from 'rxjs/operators';
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
    private loadingService: LoadingService,
    private authService: AuthService,
    ) { }

  getApi<T>(url: string, functionName: string) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<T>(url, {
          params: new HttpParams().set('auth', user?.token)
        })
      }),
      tap(() => console.log(functionName)),
      catchError(error => this.handleApiError(error))
    )
  }

  postApi<T>(url: string, req: any, functionName: string) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.post<T>(url, req, {
          params: new HttpParams().set('auth', user?.token)
        })
      }),
      tap(() => console.log(functionName)),
      catchError(error => this.handleApiError(error))
    )
  }

  deleteApi<T>(url: string, functionName: string) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.delete<T>(url, {
          params: new HttpParams().set('auth', user?.token)
        })
      }),
      tap(() => console.log(functionName)),
      catchError(error => this.handleApiError(error))
    )
  }

  updateApi<T>(url: string, req: any, functionName: string) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.put<T>(url, req, {
          params: new HttpParams().set('auth', user?.token)
        })
      }),
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
