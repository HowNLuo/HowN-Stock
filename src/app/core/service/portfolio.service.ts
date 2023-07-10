import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { FirebaseService } from './firebase.service';
import { Portfolio, PortfolioRes } from './../interface/portfolio.interface';
import { PortfolioReq } from '../interface/portfolio.interface';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  baseUrl = 'https://hown-stock-default-rtdb.firebaseio.com/';

  constructor(
    private firebase: FirebaseService
  ) { }

  /** 取得所有投資標的 */
  getPortfolios() {
    return this.firebase.getApi<PortfolioRes>(this.baseUrl + 'portfolios.json', 'getPortfolios')
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

  /** 更新投資標的 */
  updatePortfolio(id: string, req: PortfolioReq) {
    return this.firebase.updateApi(this.baseUrl + `portfolios/${id}.json`, req, 'updatePortFolio');
  }

  /** 更新所有投資標的 */
  updatePortfolios(req) {
    return this.firebase.updateApi(this.baseUrl + `portfolios.json`, req, 'updatePortFolios');
  }

  /** 刪除指定投資標的 */
  deletePortfolio(id: string) {
    return this.firebase.deleteApi(this.baseUrl + `portfolios/${id}.json`, 'deletePortFolio');
  }


}
