import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { StockService } from './../core/service/stock.service';
import { HistoricalStock, StockInfo } from './../core/interface/stock.interface';
import { mockStocks } from '../shared/mock/stock.mock';

import * as Chart from 'chart.js';
import * as moment from 'moment'
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('f') form: NgForm;
  historicalStockData: HistoricalStock[] = [];  // 30天股價資訊
  stocksInfo: StockInfo[];
  title: string;
  isHovered: boolean;
  chart: Chart;

  constructor(
    private stockService: StockService,
  ) { }

  ngOnInit() {
    this.setDatalistOptions();
  }

  /** 設定台股代號選項 */
  setDatalistOptions() {
    this.stockService.getStocksInfo()
      .pipe(
        tap(res => this.stocksInfo = res.data)
      ).subscribe();
  }

  onSearchClick() {
    const startDate = moment((new Date()).setMonth(new Date().getMonth() - 1)).format('YYYY-MM-DD')
    const req = {
      startDate: startDate,
      stockId: this.form.form.value.stockKeyword
    }
    this.stockService.getHistoricalStockData(req)
      .pipe(
        tap(res => this.historicalStockData = res.data),
        delay(0)  // 等HTML中的chart被生成
      ).subscribe(() => {
        const selectedStock = this.stocksInfo.find(stockInfo => stockInfo.stock_id === this.form.form.value.stockKeyword);
        this.title = selectedStock.stock_id + ' ' + selectedStock.stock_name
        this.drawChart();
      });
  }

    /** 繪製折線圖 */
    drawChart() {
      const canvas = document.getElementById('chart') as HTMLCanvasElement;
      if(this.chart) {
        this.chart.destroy();  // 預防canvas重複渲染
      }
      if(canvas) {
        const ctx = canvas.getContext('2d');

        let xArray = [];
        let yArray = [];
        this.historicalStockData.forEach(stockData => {
          xArray.push(stockData.date.slice(-5));
          yArray.push(stockData.close);
        });

        const data = {
          labels: xArray,
          datasets: [{
            label: `股價歷史紀錄`,
            data: yArray,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };

        const options = {};

        this.chart = new Chart(ctx, {
          type: 'line',
          data: data,
          options: options
        });
      };
    }

  toggleHover(hovered: boolean) {
    this.isHovered = hovered;
  }
}
