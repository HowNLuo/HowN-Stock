import { ApiService } from './api.service';
import { Portfolio, PortfolioRes, CategoryRes, Category, CategoryReq } from './../interface/portfolio.interface';
import { Injectable } from '@angular/core';


import { map, tap, catchError, finalize } from 'rxjs/operators';

import { PortfolioReq } from '../interface/portfolio.interface';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  baseUrl = 'https://hown-stock-default-rtdb.firebaseio.com/'

  constructor(
    private apiService: ApiService
  ) { }

  /** 取得所有投資組合 */
  getPortfolios() {
    return this.apiService.getApi<PortfolioRes>(this.baseUrl + 'portfolios.json', 'getPortfolios')
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
      )
  }

  /** 更新投資組合 */
  updatePortFolio(id: string, req: PortfolioReq) {
    return this.apiService.updateApi(this.baseUrl + `portfolios/${id}.json`, req, 'updatePortFolio');
  }

  /** 更新所有投資組合 */
  updatePortFolios(req) {
    return this.apiService.updateApi(this.baseUrl + `portfolios.json`, req, 'updatePortFolios');
  }

  /** 刪除指定投資組合 */
  deletePortFolio(id: string) {
    return this.apiService.deleteApi(this.baseUrl + `portfolios/${id}.json`, 'deletePortFolio');
  }

  /** 取得所有類別 */
  getCategories() {
    return this.apiService.getApi<CategoryRes>(this.baseUrl + 'categories.json', 'getCategories')
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
      )
  }

  /** 新增類別 */
  addCategory(req: CategoryReq) {
    return this.apiService.postApi(this.baseUrl + 'categories.json', req, 'addCategory');
  }

  /** 刪除指定類別 */
  deleteCategory(id: string) {
    return this.apiService.deleteApi(this.baseUrl + `categories/${id}.json`, 'deleteCategory');
  }

  /** 更新所有投資組合 */
  updateCategories(req) {
    return this.apiService.updateApi(this.baseUrl + 'categories.json', req, 'updateCategories');
  }
}
