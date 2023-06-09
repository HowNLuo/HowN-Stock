import { PortfolioRes } from './../core/interface/portfolio.interface';
import { PortfolioService } from './../core/service/portfolio.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { StockService } from './../core/service/stock.service';
import { TaiwanStockInfo, TaiwanStockPrice } from './../core/interface/stock.interface';
import { mockStocks } from '../shared/mock/stock.mock';

import * as Chart from 'chart.js';
import * as moment from 'moment';
import * as _ from 'lodash'
import { delay, tap, concatMap, concat } from 'rxjs/operators';
import { PortfolioReq } from '../core/interface/portfolio.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('f') form: NgForm;
  historicalStockData: TaiwanStockPrice[] = [];  // 30天股價資訊
  stocksInfo: TaiwanStockInfo[];                 // 台股各股名稱、代碼
  title: string;
  isHovered: boolean;
  chart: Chart;
  portfolio: PortfolioRes[];
  isInPortfolios: boolean;

  get dataNotFound() {
    if(this.stocksInfo) {
      return !this.stocksInfo.some(stockInfo => stockInfo.stock_id === this.form.form.value.keyword);
    } else {
      return true
    }
  }
  constructor(
    private stockService: StockService,
    private portfolioService: PortfolioService
  ) { }

  ngOnInit() {
    this.setDatalistOptions();
  }

  /** 設定台股代號選項 */
  setDatalistOptions() {
    this.stockService.getTaiwanStockInfo()
      .pipe(
        tap(res => this.stocksInfo = res.data)
      ).subscribe();
  }

  /** 提交表單，查詢股票30天的交易資訊 */
  onSearchClick() {
    const startDate = moment((new Date()).setMonth(new Date().getMonth() - 1)).format('YYYY-MM-DD')
    const req = {
      startDate: startDate,
      stockId: this.form.form.value.keyword
    }
    const selectedStock = this.stocksInfo.find(stockInfo => stockInfo.stock_id === this.form.form.value.keyword);
    this.stockService.getTaiwanStockPrice(req)
      .pipe(
        concatMap(res => {
          this.oneMonthStockData = res.data.reverse();
          this.title = selectedStock.stock_id + ' ' + selectedStock.stock_name;
          return this.portfolioService.getPortfolios();
        }),
        tap(res => {
          this.portfolio = res;
        }),
        delay(0)  // 等HTML中的chart被生成
      ).subscribe(() => {
          this.isInPortfolios = this.portfolio.some(stock => stock.stockId === selectedStock.stock_id);
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
  /** 從投資組合新增/移除 */
  setToPortfolios(stockId: string) {
    this.isLoading = true;
    const selectedStock = this.stocksInfo.find(stockInfo => stockInfo.stock_id === stockId);
    const req: PortfolioReq = {
      stockId: selectedStock.stock_id,
      stockName: selectedStock.stock_name,
      stockCategory: ''
    }
    if(this.isInPortfolios) {
      const deleteId = this.portfolio.find(stock => stock.stockId === stockId).id;
      this.portfolioService.deletePortFolio(deleteId)
        .pipe(concatMap(() => this.portfolioService.getPortfolios()))
        .subscribe(res => {
          this.portfolio = res;
          this.isLoading = false;
          this.isHovered = false;
          this.drawChart();
        });
    } else {
      this.portfolioService.addPortFolio(req)
        .pipe(concatMap(() => this.portfolioService.getPortfolios()))
        .subscribe(res => {
          this.portfolio = res;
          this.isLoading = false;
          this.drawChart();
        })
    }
    this.isInPortfolios = !this.isInPortfolios;
  }

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
