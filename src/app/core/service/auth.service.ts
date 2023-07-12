import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, tap } from 'rxjs/operators'
import { BehaviorSubject, throwError } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { User } from './../../auth/user.modal';
import { ModalDialogComponent } from './../../shared/modals/modalDialog/modalDialog.component';
import { LoadingService } from './loading.service';
import { environment } from 'src/environments/environment';

interface AuthReq {
  email: string;
  password: string;
  returnSecureToken: boolean;
}

export interface AuthRes {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  modalRef: BsModalRef;
  user = new BehaviorSubject<User>(null);
  userId: string;
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private bsModalService: BsModalService,
    private router: Router
    ) { }

  /** 註冊 */
  signUp(email: string, password: string) {
    const req: AuthReq = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthRes>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, req)
      .pipe(
        tap(() => console.log('signUp')),
        tap(res => this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn)),
        catchError(error => this.handleApiError(error))
      );
  }
  /** 登入 */
  login(email: string, password: string) {
    const req: AuthReq = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthRes>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, req)
      .pipe(
        tap(() => console.log('login')),
        tap(res => this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn)),
        catchError(error => this.handleApiError(error))
      );
  }

  /** 登出 */
  logout() {
    this.user.next(null);
    this.userId = '';
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    };
    this.tokenExpirationTimer = null;
  }

  /** 自動登入 */
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData) {
      return;
    };

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(loadedUser.token) {
      this.user.next(loadedUser);
      this.userId = loadedUser.id;

      // 重新登入，需設定有效時間
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    };
  }

  /** 自動登出(設定有效時間) */
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.modalRef = this.bsModalService.show(ModalDialogComponent, {initialState: {type: 'alert', message: '登入時效到期，請重新登入。'}})
    }, expirationDuration);
  }

  /** 身份驗證處理 */
  private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number) {
    // 有效時間
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(email, localId, idToken, expirationDate);

    this.user.next(user);
    this.userId = localId;
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /** 錯誤處理 */
  handleApiError(error: HttpErrorResponse) {
    console.error('API錯誤', error);
    this.loadingService.hide();
    this.modalRef = this.bsModalService.show(ModalDialogComponent, {initialState: {type: 'error', message: error.error.error.message}});
    return throwError('發生錯誤');
  }
}
