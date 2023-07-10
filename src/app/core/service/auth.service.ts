import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, tap } from 'rxjs/operators'
import { BehaviorSubject, throwError } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { User } from './../../auth/user.modal';
import { ErrorComponent } from 'src/app/shared/modals/error/error.component';

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
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private bsModalService: BsModalService,
    private router: Router
    ) { }

  signUp(email: string, password: string) {
    const req: AuthReq = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthRes>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBI5yF4viePug_6zPRgqbpUjsYmvrlPhx8', req)
      .pipe(
        tap(() => console.log('signUp')),
        tap(res => this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn)),
        catchError(error => this.handleApiError(error))
      );
  }

  login(email: string, password: string) {
    const req: AuthReq = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthRes>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBI5yF4viePug_6zPRgqbpUjsYmvrlPhx8', req)
      .pipe(
        tap(res => console.log('signIn', res)),
        tap(res => this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn)),
        catchError(error => this.handleApiError(error))
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData')
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

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
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    };
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(email, localId, idToken, expirationDate);

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /** 錯誤處理 */
  handleApiError(error: any) {
    console.error('API錯誤', error);
    this.loadingService.hide();
    this.modalRef = this.bsModalService.show(ErrorComponent, {initialState: {error}})
    return throwError('發生錯誤');
  }
}
