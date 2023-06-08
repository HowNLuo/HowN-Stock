import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HistoricalStocks, StocksInfo } from '../interface/stock.interface';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private http: HttpClient
  ) { }

  // 取得個股資訊
  getStocksInfo() {
    return this.http.get<StocksInfo>(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo`)
      .pipe(
        // 錯誤處理
      )
  }

  // 取得股價日成交資訊
  getHistoricalStockData(req) {
    return this.http.get<HistoricalStocks>(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=${req.stockId}&start_date=${req.startDate}`)
      .pipe(
        // 錯誤處理
      )
  }

}
