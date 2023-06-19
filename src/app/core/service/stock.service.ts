import { ApiService } from './api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TaiwanStockInfoRes, TaiwanStockPriceRes } from '../interface/stock.interface';

import { catchError, finalize, tap } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';
import { ErrorComponent } from 'src/app/shared/modals/error/error.component';

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
    private apiService: ApiService
  ) { }

  /** 取得所有個股資訊 */
  getTaiwanStockInfo() {
    return this.apiService.getApi<TaiwanStockInfoRes>
      (this.baseUrl + `dataset=${Dataset.TaiwanStockInfo}`, 'getTaiwanStockInfo')
  }

  /** 取得個股日成交資訊 */
  getTaiwanStockPrice(req) {
    return this.apiService.getApi<TaiwanStockPriceRes>
      (this.baseUrl + `dataset=${Dataset.TaiwanStockPrice}` + `&data_id=${req.stockId}` + `&start_date=${req.startDate}`, 'getTaiwanStockPrice')
  }
}
