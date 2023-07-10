import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

import { TaiwanStockInfoRes, TaiwanStockPriceRes } from '../interface/stock.interface';

export enum Dataset {
  TaiwanStockInfo = 'TaiwanStockInfo',
  TaiwanStockPrice = 'TaiwanStockPrice'
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  baseUrl = 'https://api.finmindtrade.com/api/v4/data?'

  constructor(
    private http: HttpClient
  ) { }

  /** 取得所有個股資訊 */
  getTaiwanStockInfo() {
    return this.http.get<TaiwanStockInfoRes>
      (this.baseUrl + `dataset=${Dataset.TaiwanStockInfo}`);
  }

  /** 取得個股日成交資訊 */
  getTaiwanStockPrice(req) {
    return this.http.get<TaiwanStockPriceRes>
      (this.baseUrl + `dataset=${Dataset.TaiwanStockPrice}` + `&data_id=${req.stockId}` + `&start_date=${req.startDate}`);
  }
}
