import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Shareholding, ShareholdingRes } from './../interface/shareholding.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ShareholdingService {
  baseUrl = 'https://hown-stock-default-rtdb.firebaseio.com/';

  constructor(
    private apiService: ApiService
  ) { }

  /** 取得投資明細 */
  getShareholding() {
    return this.apiService.getApi<ShareholdingRes>(this.baseUrl + 'shareholding.json', 'getShareholding')
      .pipe(
        map(res => {
          const postsArray: Shareholding[] = [];
          for(const key in res) {
            if(res.hasOwnProperty(key)) {
              postsArray.push({...res[key], id: key});
            }
          }
          return postsArray;
        }),
      )
  }

  /** 新增持股明細 */
  addShareholding(req: Shareholding) {
    return this.apiService.postApi(this.baseUrl + 'shareholding.json', req, 'addShareholding');
  }

  /** 刪除持股明細 */
  deleteShareholding(id: string) {
    return this.apiService.deleteApi(this.baseUrl + `shareholding/${id}.json`, 'deleteShareholding');
  }

  /** 更新持股明細 */
  updateShareholding(req) {
    return this.apiService.updateApi(this.baseUrl + 'shareholding.json', req, 'updateShareholding');
  }
}