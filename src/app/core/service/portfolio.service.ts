import { Portfolio, PortfolioRes, CategoryRes, Category, CategoryReq } from './../interface/portfolio.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PortfolioReq } from '../interface/portfolio.interface';

import { map, tap, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

baseUrl = 'https://hown-stock-default-rtdb.firebaseio.com/'

constructor(
  private http: HttpClient
) { }

  /** 取得所有投資組合 */
  getPortfolios() {
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
      )
  }

  /** 更新投資組合 */
  updatePortFolio(id: string, req: PortfolioReq) {
    return this.http.put<{name: string}>(this.baseUrl + `portfolios/${id}.json`, req)
      .pipe(
        tap(() => console.log('updatePortFolio')),
        // 錯誤處理
      )
  }

  /** 更新所有投資組合 */
  updatePortFolios(req: Portfolio[]) {
    return this.http.put<{name: string}>(this.baseUrl + `portfolios.json`, req)
      .pipe(
        tap(() => console.log('updatePortFolios')),
        // 錯誤處理
      )
  }

  /** 刪除指定投資組合 */
  deletePortFolio(id: string) {
    return this.http.delete(this.baseUrl + `portfolios/${id}.json`)
      .pipe(
        tap(() => console.log('deletePortFolio')),
        // 錯誤處理
      )
  }

  /** 取得所有類別 */
  getCategories() {
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
      )
  }

  /** 新增類別 */
  addCategory(req: CategoryReq) {
    return this.http.post<{name: string}>(this.baseUrl + 'categories.json', req)
      .pipe(
        tap(() => console.log('addCategory')),
        // 錯誤處理
      )
  }

  /** 刪除指定類別 */
  deleteCategory(id: string) {
    return this.http.delete(this.baseUrl + `categories/${id}.json`)
      .pipe(
        tap(() => console.log('deleteCategory')),
        // 錯誤處理
      )
  }

  /** 更新所有投資組合 */
  updateCategories(req) {
    return this.http.put(this.baseUrl + 'categories.json', req)
      .pipe(
        tap(() => console.log('updateCategories')),
        // 錯誤處理
      )
  }

}
