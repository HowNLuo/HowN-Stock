import { Portfolio, PortfolioRes, CategoryRes, Category, CategoryReq } from './../interface/portfolio.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { map, tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ErrorComponent } from 'src/app/shared/modals/error/error.component';
import { PortfolioReq } from '../interface/portfolio.interface';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  modalRef: BsModalRef;
  isLoading: boolean = false;

  baseUrl = 'https://hown-stock-default-rtdb.firebaseio.com/'

  constructor(
    private http: HttpClient,
    private bsModalService: BsModalService
  ) { }

  /** 取得所有投資組合 */
  getPortfolios() {
    this.isLoading = true;
    return this.http.get<PortfolioRes>(this.baseUrl + 'portfolios.json')
      .pipe(
        map(res => {
          const postsArray: Portfolio[] = [];
          for(const key in res) {
            if(res.hasOwnProperty(key)) {
              postsArray.push({...res[key], id: key});
            }
          }
          return postsArray;
        }),
        tap(() => console.log('getPortfolios')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }

  /** 更新投資組合 */
  updatePortFolio(id: string, req: PortfolioReq) {
    this.isLoading = true;
    return this.http.put<{name: string}>(this.baseUrl + `portfolios/${id}.json`, req)
      .pipe(
        tap(() => console.log('updatePortFolio')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }

  /** 更新所有投資組合 */
  updatePortFolios(req: Portfolio[]) {
    this.isLoading = true;
    return this.http.put<{name: string}>(this.baseUrl + `portfolios.json`, req)
      .pipe(
        tap(() => console.log('updatePortFolios')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }

  /** 刪除指定投資組合 */
  deletePortFolio(id: string) {
    this.isLoading = true;
    return this.http.delete(this.baseUrl + `portfolios/${id}.json`)
      .pipe(
        tap(() => console.log('deletePortFolio')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }

  /** 取得所有類別 */
  getCategories() {
    this.isLoading = true;
    return this.http.get<CategoryRes>(this.baseUrl + 'categories.json')
      .pipe(
        map(res => {
          const postsArray: Category[] = [];
          for(const key in res) {
            if(res.hasOwnProperty(key)) {
              postsArray.push({...res[key], id: key});
            }
          }
          return postsArray;
        }),
        tap(() => console.log('getCategories')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }

  /** 新增類別 */
  addCategory(req: CategoryReq) {
    this.isLoading = true;
    return this.http.post<{name: string}>(this.baseUrl + 'categories.json', req)
      .pipe(
        tap(() => console.log('addCategory')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }

  /** 刪除指定類別 */
  deleteCategory(id: string) {
    this.isLoading = true;
    return this.http.delete(this.baseUrl + `categories/${id}.json`)
      .pipe(
        tap(() => console.log('deleteCategory')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }

  /** 更新所有投資組合 */
  updateCategories(req) {
    this.isLoading = true;
    return this.http.put(this.baseUrl + 'categories.json', req)
      .pipe(
        tap(() => console.log('updateCategories')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }

  handleApiError(error: any) {
    console.error('API錯誤', error);
    this.modalRef = this.bsModalService.show(ErrorComponent, {initialState: {error}})
    return throwError('發生錯誤')
  }
}
