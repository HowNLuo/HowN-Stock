import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PortfolioService } from './../core/service/portfolio.service';
import { StockService } from './../core/service/stock.service';
import { Category, Portfolio, CategoryReq } from './../core/interface/portfolio.interface';
import { TaiwanStockPrice, TaiwanStockPriceReq } from '../core/interface/stock.interface';

import * as moment from 'moment'
import * as _ from 'lodash';
import { concatMap, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss']
})
export class PortfoliosComponent implements OnInit {
  @ViewChild('f') form: NgForm;
  categories: Category[];
  portfolios: Portfolio[];
  isLoading: boolean = false;
  editingItem: string = '';
  editingName: string = '';
  categroiesEdited: Category[];
  portfoliosEdited: Portfolio[];
  isDragging: boolean = false;
  draggedIndex: number;
  currentCategory: Category;
  currentPortfolios: Portfolio[] = [];
  currentPortfoliosStockInfo: TaiwanStockPrice[] = [];

  constructor(
    private portfolioService: PortfolioService,
    private stockService: StockService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.portfolioService.getPortfolios()
      .subscribe(res => {
        this.portfolios = res;
        this.portfolioService.getCategories()
          .pipe(
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
                    this.isLoading = false;
                  });
              } else {
                this.categories = res;
                this.currentCategory = res[0];
                this.changeTab(res[0].id);
                this.isLoading = false;
              }
            })
          )
          .subscribe();
      });
  }

  changeTab(id: string) {
    this.currentCategory = this.categories.find(category => category.id === id);
    if(this.portfolios) {

    }
    this.currentPortfolios = this.portfolios.filter(portfolio => portfolio.categories.includes(this.currentCategory.id));

    this.getCurrentPortfoliosStockInfo();
  }

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

    forkJoin(observables).subscribe(res => {
      res.forEach(r => {
        this.currentPortfoliosStockInfo.push(r.data[r.data.length - 1]);
      });
    });
  }

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

  startEditCategories() {
    this.categroiesEdited = _.cloneDeep(this.categories);
    this.portfoliosEdited = _.cloneDeep(this.portfolios);
  }

  endEditCategories() {
    if(this.categories !== this.categroiesEdited) {
      this.isLoading = true;
      this.categories = this.categroiesEdited;
      const transformedData = {}
      this.categroiesEdited.map(category => {
        transformedData[category.id] = {
          categoryName: category.categoryName
        };
      })

      this.portfolioService.updateCategories(transformedData)
        .pipe(
          concatMap(() => this.portfolioService.updatePortFolios(this.portfoliosEdited))
        )
        .subscribe(() => {
          this.portfolios = this.portfoliosEdited;
          if(this.currentCategory.id) {
            this.changeTab(this.currentCategory.id);
          } else {
            this.currentCategory = this.categories[0];
            this.changeTab(this.categories[0].id);
          }
          this.isLoading = false;
        });
    }
  }

  startEditCategoryName(category: Category) {
    this.editingItem = this.editingName = category.categoryName;
  }

  endEditCategoryName(index: number) {
    this.editingItem = '';
    this.categroiesEdited[index].categoryName = this.editingName;
  }

  deleteCategory(categoryId: string, index: number) {
    this.categroiesEdited.splice(index, 1);
    this.portfoliosEdited.forEach(portfolio => {
      portfolio.categories = portfolio.categories.filter(category => category !== categoryId);
    });
    this.portfoliosEdited.filter(portfolio => portfolio.categories.length === 0);
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
