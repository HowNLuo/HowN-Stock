import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Shareholding, ShareholdingRes } from './../interface/shareholding.interface';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ShareholdingService {
  baseUrl = 'https://hown-stock-default-rtdb.firebaseio.com/';

  constructor(
    private firebase: FirebaseService,
    private authService: AuthService
  ) { }

  /** 取得投資明細 */
  getShareholding() {
    return this.firebase.getApi<ShareholdingRes>(this.baseUrl + this.authService.userId + '/shareholding.json', 'getShareholding')
      .pipe(
        map(res => {
          const postsArray: Shareholding[] = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              postsArray.push({...res[key], id: key});
            }
          }
          return postsArray;
        }),
      )
  }

  /** 新增持股明細 */
  addShareholding(req: Shareholding) {
    return this.firebase.postApi(this.baseUrl + this.authService.userId + '/shareholding.json', req, 'addShareholding');
  }

  /** 刪除持股明細 */
  deleteShareholding(id: string) {
    return this.firebase.deleteApi(this.baseUrl + this.authService.userId + `/shareholding/${id}.json`, 'deleteShareholding');
  }

  /** 更新持股明細 */
  updateShareholding(req) {
    return this.firebase.updateApi(this.baseUrl + this.authService.userId + '/shareholding.json', req, 'updateShareholding');
  }
}
