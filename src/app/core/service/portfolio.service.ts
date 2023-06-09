import { PortfolioRes } from './../interface/portfolio.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PortfolioReq } from '../interface/portfolio.interface';

import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

baseUrl = 'https://hown-stock-default-rtdb.firebaseio.com/'

constructor(
  private http: HttpClient
) { }

  // 取得投資組合
  getPortfolios() {
    return this.http.get<PortfolioRes[]>(this.baseUrl + 'portfolios.json')
      .pipe(
        map(res => {
          const postsArray: PortfolioRes[] = [];
          for(const key in res) {
            if(res.hasOwnProperty(key)) {
              postsArray.push({...res[key], id: key});
            }
          }
          return postsArray;
        }),
        // 錯誤處理
      )
  }

  // 新增投資組合
  addPortFolio(req: PortfolioReq) {
    return this.http.post<{name: string}>(this.baseUrl + 'portfolios.json', req)
      .pipe(
        // 錯誤處理
      )
  }

  // 刪除投資組合
  deletePortFolio(id: string) {
    return this.http.delete(this.baseUrl + `portfolios/${id}.json`)
      .pipe(
        // 錯誤處理
      )
  }

}
