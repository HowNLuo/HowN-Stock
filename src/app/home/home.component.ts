import { Category, Portfolio } from './../core/interface/portfolio.interface';
import { PortfolioService } from './../core/service/portfolio.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { StockService } from './../core/service/stock.service';
import { TaiwanStockInfo, TaiwanStockPrice, TaiwanStockPriceReq } from './../core/interface/stock.interface';

import * as Chart from 'chart.js';
import * as moment from 'moment';
import * as _ from 'lodash'
import { delay, tap, concatMap } from 'rxjs/operators';
import { PortfolioReq } from '../core/interface/portfolio.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('keywordForm') keywordForm: NgForm;  // 搜尋欄位
  oneMonthStockData: TaiwanStockPrice[] = [];     // 30天內股票成交資訊
  stocksInfo: TaiwanStockInfo[];                  // 所有個股基本資訊
  title: string;                                  // 所選股票-代號+名稱
  isHovered: boolean;                             // 懸停星號
  chart: Chart;                                   // 折線圖
  isLoading: boolean = false;                     // 判斷是否加載中
  portfolios: Portfolio[] = [];                   // 所有投資組合
  categories: Category[];                         // 所有類別
  selectedStock: TaiwanStockInfo;                 // 所選股票的基本資訊
  selectedPortfolio: Portfolio;                   // 所選股票的投資組合資訊
  selectedCategories: string[] = [];              // 所選股票的類別(編輯)
  cloneSelectedCategories: string[];              // 所選股票的類別(初始)

  // 搜尋欄位是否查無個股
  get dataNotFound() { return this.stocksInfo?.every(stockInfo => stockInfo.stock_id !== this.keywordForm.form.value.keyword); }

  // 所選股票是否加入至投資組合
  get isInPortfolios() { return this.portfolios ? this.portfolios.some(portfolio => portfolio.stockId === this.selectedStock.stock_id) : false; }

  constructor(
    private stockService: StockService,
    private portfolioService: PortfolioService
  ) { }

  ngOnInit() {
    this.setDatalistOptions();
  }

  /** 設定台股代號選項 */
  setDatalistOptions() {
    this.isLoading = true;
    this.stockService.getTaiwanStockInfo()
      .subscribe(res => {
        this.stocksInfo = res.data;
        this.isLoading = false;
      });
  }

  /** 提交表單，查詢股票30天的交易資訊 */
  onSearchClick() {
    this.isLoading = true;
    const startDate = moment((new Date()).setMonth(new Date().getMonth() - 1)).format('YYYY-MM-DD')
    const req: TaiwanStockPriceReq = {
      startDate: startDate,
      stockId: this.keywordForm.form.value.keyword
    }
    this.selectedStock = this.stocksInfo.find(stockInfo => stockInfo.stock_id === this.keywordForm.form.value.keyword);
    this.stockService.getTaiwanStockPrice(req)
      .pipe(
        concatMap(res => {
          this.oneMonthStockData = res.data.reverse();
          this.title = this.selectedStock.stock_id + ' ' + this.selectedStock.stock_name;
          return this.portfolioService.getPortfolios();
        }),
        tap(res => {
          if(res.length > 0) {
            this.portfolios = res;
            this.selectedPortfolio = res.find(portfolio => portfolio.stockId === this.keywordForm.form.value.keyword);
            this.selectedCategories = res.find(portfolio => portfolio.stockId === this.selectedStock.stock_id)?.categories ?? [];
            this.cloneSelectedCategories = _.cloneDeep(this.selectedCategories);
          }
          this.isLoading = false;
        }),
        delay(0)  // 等HTML中的chart被生成
      ).subscribe(() => {
          this.drawChart();
      });
  }

  /** 開始分類投資組合至各類別 */
  startClassifyPortfolio() {
    if(!this.categories) {
      this.isLoading = true;
      this.portfolioService.getCategories()
        .subscribe(res => {
            this.categories = res;
            this.isLoading = false;
          }
        )
    }
  }

  /** 提交分類結果 */
  endClassifyPortfolio() {
    if(this.selectedCategories.length === 0) {
      this.removeFromPortfolios();
    } else {
      const req: PortfolioReq = {
        stockId: this.selectedStock.stock_id,
        stockName: this.selectedStock.stock_name,
        categories: this.selectedCategories
      };
      this.portfolioService.updatePortFolio(this.selectedStock.stock_id, req)
        .pipe(
          concatMap(() => this.portfolioService.getPortfolios()),
          tap(res => this.portfolios = res)
        )
        .subscribe();
    }
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
      this.oneMonthStockData.forEach(stockData => {
        xArray.push(stockData.date.slice(-5));
        yArray.push(stockData.close);
      });

      const data = {
        labels: xArray.reverse(),
        datasets: [{
          label: `30日股價歷史紀錄`,
          data: yArray.reverse(),
          fill: false,
          borderColor: '#2196F3',
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

  /** 懸停/離開 */
  toggleHover(hovered: boolean) {
    this.isHovered = hovered;
  }

  /** 勾選類別 */
  toggleCategory(categoryId: string, isChecked: boolean) {
    if(isChecked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(category => category !== categoryId);
    }
  }

  /** 還原選取的類別 */
  revertCategory() {
    this.selectedCategories = _.cloneDeep(this.cloneSelectedCategories);
  }

  /** 從投資組合中移除 */
  removeFromPortfolios() {
    this.portfolioService.deletePortFolio(this.selectedStock.stock_id)
    .pipe(
      concatMap(() => this.portfolioService.getPortfolios()),
      tap(res => this.portfolios = res)
    )
    .subscribe();
  }
}
