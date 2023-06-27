import { Injectable } from '@angular/core';

import { CategoryRes, Category, CategoryReq } from '../interface/portfolio.interface';
import { ApiService } from './api.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl = 'https://hown-stock-default-rtdb.firebaseio.com/';

  constructor(
    private apiService: ApiService
  ) { }

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

  /** 更新所有投資標的 */
  updateCategories(req) {
    return this.apiService.updateApi(this.baseUrl + 'categories.json', req, 'updateCategories');
  }
}
