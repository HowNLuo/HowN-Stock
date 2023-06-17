import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PortfolioService } from './../core/service/portfolio.service';
import { StockService } from './../core/service/stock.service';
import { Category, Portfolio, CategoryReq } from './../core/interface/portfolio.interface';
import { TaiwanStockPrice, TaiwanStockPriceReq } from '../core/interface/stock.interface';

import * as moment from 'moment'
import * as _ from 'lodash';
import { concatMap, tap } from 'rxjs/operators';
import { concat, forkJoin } from 'rxjs';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss']
})
export class PortfoliosComponent implements OnInit {
  @ViewChild('f') form: NgForm;                         //  新增類別的表單
  categories: Category[];                               //  所有類別
  portfolios: Portfolio[];                              //  所有投資組合
  isLoading: boolean = false;                           //  加載中
  editingItem: string = '';                             //  點選兩下編輯的類別
  editingName: string = '';                             //  點選兩下編輯的類別名稱
  categroiesEdited: Category[];                         //  編輯中的所有類別
  portfoliosEdited: Portfolio[];                        //  編輯中的所有投資組合
  isDragging: boolean = false;                          //  是否正在拖曳
  draggedIndex: number;                                 //  被拖曳的index
  currentCategory: Category;                            //  當前類別
  currentPortfolios: Portfolio[] = [];                  //  當前類別的所有投資組合
  currentPortfoliosStockInfo: TaiwanStockPrice[] = [];  //  當前類別的所有投資組合的基本資訊

  constructor(
    private portfolioService: PortfolioService,
    private stockService: StockService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.portfolioService.getPortfolios()
      .pipe(
        tap(res => this.portfolios = res),
        concatMap(() => this.portfolioService.getCategories()),
        tap(res => {
          // 如果沒有類別，預設「我的」類別
          if(res.length === 0){
            const req: CategoryReq = {categoryName: '我的'};
            this.portfolioService.addCategory(req)
              .pipe(
                concatMap(() => this.portfolioService.getCategories())
              )
              .subscribe(res => {
                this.categories = res;
                this.currentCategory = res[0];
                this.changeTab(res[0].id);
              });
          } else {
            this.categories = res;
            this.currentCategory = res[0];
            this.changeTab(res[0].id);
          }
        })
      )
      .subscribe();
  }

  /** 切換Tab */
  changeTab(id: string) {
    this.isLoading = true;
    this.currentCategory = this.categories.find(category => category.id === id);
    this.currentPortfolios = this.portfolios.filter(portfolio => portfolio.categories.includes(this.currentCategory.id));

    this.getCurrentPortfoliosStockInfo();
  }

  /** 取得當前類別的所有投資組合的日成交資訊 */
  getCurrentPortfoliosStockInfo() {
    this.currentPortfoliosStockInfo = [];

    // 取一個月前的日期，預防股票休市
    const startDate = moment((new Date()).setMonth(new Date().getMonth() - 1)).format('YYYY-MM-DD');

    const observables = this.currentPortfolios.map(portfolio => {
      const req: TaiwanStockPriceReq = {
        stockId: portfolio.stockId,
        startDate: startDate
      };
      return this.stockService.getTaiwanStockPrice(req);
    });

    // 一次取得所有股票的日成交資訊
    forkJoin(observables).subscribe(res => {
      res.forEach(r => {
        this.currentPortfoliosStockInfo.push(r.data[r.data.length - 1]);
      });
    });
    this.isLoading = false;
  }

  /** 提交新增類別表單 */
  onAddCategorySubmit(categoryName: string) {
    const req: CategoryReq = {categoryName: categoryName};
    this.portfolioService.addCategory(req)
      .pipe(
        concatMap(() => this.portfolioService.getCategories()),
        tap(res => this.categories = res)
      )
      .subscribe();
    this.form.reset();
  }

  /** 開始編輯類別，事先備份編輯前資料 */
  startEditCategories() {
    this.categroiesEdited = _.cloneDeep(this.categories);
    this.portfoliosEdited = _.cloneDeep(this.portfolios);
  }

  /** 結束編輯類別 */
  endEditCategories() {
    if(!_.isEqual(this.categories, this.categroiesEdited)) {
      this.isLoading = true;
      this.categories = this.categroiesEdited;
      const transformedData = {}
      this.categroiesEdited.map(category => {
        transformedData[category.id] = {
          categoryName: category.categoryName
        };
      })
      this.portfolioService.updateCategories(transformedData)
        .subscribe(() => {
          // 如果刪除的類別為當下類別，則需切換tab為第一個類別
          if(!this.categories.some(category => category.id === this.currentCategory.id)) {
            this.currentCategory = this.categories[0];
            this.changeTab(this.categories[0].id);
          } else {
            this.changeTab(this.currentCategory.id);
          }
        });

      if(!_.isEqual(this.portfolios, this.portfoliosEdited)) {
        this.portfolios = this.portfoliosEdited;
        this.portfolioService.updatePortFolios(this.portfoliosEdited)
          .subscribe();
      }
    }
  }

  /** 開始編輯類別名稱 */
  startEditCategoryName(category: Category) {
    this.editingItem = this.editingName = category.categoryName;
  }

  /** 結束編輯類別名稱 */
  endEditCategoryName(index: number) {
    this.editingItem = '';
    this.categroiesEdited[index].categoryName = this.editingName;
  }

  /** 刪除指定類別 */
  deleteCategory(categoryId: string, index: number) {
    this.categroiesEdited.splice(index, 1);

    // 刪除類別，包含該類別的投資組合也要移除該類別，如果投資組合的類別皆被刪除，則移除該投資組合
    this.portfoliosEdited.forEach(portfolio => portfolio.categories = portfolio.categories.filter(category => category !== categoryId));
    this.portfoliosEdited.filter(portfolio => portfolio.categories.length !== 0);
  }

  onDragStart(index: number) {
    this.isDragging = true;
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.draggedIndex !== index) {
      [this.categroiesEdited[this.draggedIndex], this.categroiesEdited[index]] = [this.categroiesEdited[index], this.categroiesEdited[this.draggedIndex]];
      this.draggedIndex = index;
    };
  }

  onDragEnd() {
    this.isDragging = false;
    this.draggedIndex = null;
  }

  test() {
    console.log('categroiesEdited',this.categroiesEdited)
    console.log(this.portfolios)
    console.log(this.portfoliosEdited)
  }

}
