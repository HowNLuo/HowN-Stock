import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { Injectable } from '@angular/core';

import { CategoryRes, Category, CategoryReq } from '../interface/portfolio.interface';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl = 'https://hown-stock-default-rtdb.firebaseio.com/';

  constructor(
    private firebase: FirebaseService,
    private authService: AuthService
  ) { }

  /** 取得所有類別 */
  getCategories() {
    return this.firebase.getApi<CategoryRes>(this.baseUrl + this.authService.userId + '/categories.json', 'getCategories')
      .pipe(
        map(res => {
          const postsArray: Category[] = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              postsArray.push({...res[key], id: key});
            };
          };
          return postsArray;
        }),
      )
  };

  /** 新增類別 */
  addCategory(req: CategoryReq) {
    return this.firebase.postApi(this.baseUrl + this.authService.userId + '/categories.json', req, 'addCategory');
  }

  /** 刪除指定類別 */
  deleteCategory(id: string) {
    return this.firebase.deleteApi(this.baseUrl + this.authService.userId + `/categories/${id}.json`, 'deleteCategory');
  }

  /** 更新所有投資標的 */
  updateCategories(req) {
    return this.firebase.updateApi(this.baseUrl + this.authService.userId + '/categories.json', req, 'updateCategories');
  }
}
