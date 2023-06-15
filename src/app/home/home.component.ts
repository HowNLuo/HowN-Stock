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
  @ViewChild('keywordForm') keywordForm: NgForm;
  oneMonthStockData: TaiwanStockPrice[] = [];
  stocksInfo: TaiwanStockInfo[];
  title: string;
  isHovered: boolean;
  chart: Chart;
  portfolios: Portfolio[] = [];
  isLoading: boolean = false;
  categories: Category[];
  selectedCategories: string[] = [];
  selectedStock: TaiwanStockInfo;
  selectedPortfolio: Portfolio;
  cloneSelectedCategories: string[];

  get dataNotFound() { return !this.stocksInfo?.some(stockInfo => stockInfo.stock_id === this.keywordForm.form.value.keyword); }
  get isInPortfolios() {
    if(this.portfolios) {
      return this.portfolios.some(portfolio => portfolio.stockId === this.selectedStock.stock_id);
    } else {
      return false;
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
          }
          this.isLoading = false;
        }),
        delay(0)  // 等HTML中的chart被生成
      ).subscribe(() => {
          this.drawChart();
      });
  }

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
    this.selectedCategories = this.portfolios.find(portfolio => portfolio.stockId === this.selectedStock.stock_id)?.categories ?? [];
    this.cloneSelectedCategories = _.cloneDeep(this.selectedCategories);
  }

  endClassifyPortfolio() {
    if(this.selectedCategories.length === 0) {
      this.portfolioService.deletePortFolio(this.selectedStock.stock_id)
        .pipe(
          concatMap(() => this.portfolioService.getPortfolios()),
          tap(res => this.portfolios = res)
        )
        .subscribe();
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

  toggleHover(hovered: boolean) {
    this.isHovered = hovered;
  }

  toggleCategory(categoryId: string, isChecked: boolean) {
    if(isChecked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(category => category !== categoryId);
    }
  }

  /** 還原選取的 */
  revertCategory() {
    this.selectedCategories = this.cloneSelectedCategories;
  }
}
