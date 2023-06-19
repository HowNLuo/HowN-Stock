import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TaiwanStockInfoRes, TaiwanStockPriceRes } from '../interface/stock.interface';

import { catchError, finalize, tap } from 'rxjs/operators'
import { throwError } from 'rxjs';
import { ErrorComponent } from 'src/app/shared/modals/error/error.component';

export enum Dataset {
  TaiwanStockInfo = 'TaiwanStockInfo',
  TaiwanStockPrice = 'TaiwanStockPrice'
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  modalRef: BsModalRef;
  isLoading: boolean = false;
  baseUrl = 'https://api.finmindtrade.com/api/v4/data?'

  constructor(
    private http: HttpClient,
    private bsModalService: BsModalService
  ) { }

  /** 取得所有個股資訊 */
  getTaiwanStockInfo() {
    this.isLoading = true;
    return this.http.get<TaiwanStockInfoRes>(this.baseUrl + `dataset=${Dataset.TaiwanStockInfo}`)
      .pipe(
        tap(() => console.log('getTaiwanStockInfo')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }

  /** 取得個股日成交資訊 */
  getTaiwanStockPrice(req) {
    this.isLoading = true;
    return this.http.get<TaiwanStockPriceRes>(this.baseUrl + `dataset=${Dataset.TaiwanStockPrice}` + `&data_id=${req.stockId}` + `&start_date=${req.startDate}`)
      .pipe(
        tap(() => console.log('getTaiwanStockPrice')),
        // 錯誤處理
        catchError(error => this.handleApiError(error)),
        finalize(() => this.isLoading = false)
      )
  }


  handleApiError(error: any) {
    console.error('API錯誤', error);
    this.modalRef = this.bsModalService.show(ErrorComponent, {initialState: {error}})
    return throwError('發生錯誤')
  }
}
