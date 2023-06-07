import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HistoricalStocks, StockInfo } from '../interface/stock.interface';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private http: HttpClient
  ) { }

  // 取得個股資訊
  getStockInfo(req) {
    return this.http.get<StockInfo>(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo&data_id=${req.stockId}`)
      .pipe(
        // 錯誤處理
      )
  }

  // 取得股價日成交資訊
  getHistoricalStockData(req) {
    return this.http.get<HistoricalStocks>(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=${req.stockId}&start_date=${req.startDate}&end_date=${req.endDate}`)
      .pipe(
        // 錯誤處理
      )
  }

}
