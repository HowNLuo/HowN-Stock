import { Category, Portfolio, CategoryReq } from './../core/interface/portfolio.interface';
import { Component, OnInit, ViewChild } from '@angular/core';

import { PortfolioService } from './../core/service/portfolio.service';
import { NgForm } from '@angular/forms';
import { concatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss']
})
export class PortfoliosComponent implements OnInit {
  @ViewChild('f') form: NgForm;
  categories: Category[];
  portfolios: Portfolio[];
  currentCategoryId: string;
  isLoading: boolean = false;
  editingItem: string = '';
  editingName: string = '';

  constructor(
    private portfolioService: PortfolioService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.portfolioService.getPortfolios()
      .subscribe(res => this.portfolios = res);
    this.portfolioService.getCategories()
      .pipe(
        tap(res => {
          if(res.length === 0){
            const req: CategoryReq = {categoryName: '我的'};
            this.portfolioService.addCategory(req)
              .pipe(
                concatMap(() => this.portfolioService.getCategories())
              )
              .subscribe(res => {
                this.categories = res;
                this.currentCategoryId = res[0]?.id;
                this.isLoading = false;
              });
          } else {
            this.categories = res;
            this.currentCategoryId = res[0]?.id;
            this.isLoading = false;
          }
        })
      )
      .subscribe();
  }

  onCategoryNameSubmit(categoryName: string) {
    const req: CategoryReq = {categoryName: categoryName};
    this.portfolioService.addCategory(req)
      .pipe(
        concatMap(() => this.portfolioService.getCategories()),
        tap(res => this.categories = res)
      )
      .subscribe();
  }

  startEdit(category: Category) {
    this.editingItem = this.editingName = category.categoryName;
  }

  endEdit(id: string) {
    this.editingItem = '';
    const req: CategoryReq = {
      categoryName: this.editingName
    }
    this.portfolioService.updateCategory(id, req)
      .pipe(
        concatMap(() => this.portfolioService.getCategories()),
        tap(res => this.categories = res)
      )
      .subscribe();
  }

  deleteCategory(id: string) {
    this.portfolioService.deleteCategory(id)
      .pipe(
        concatMap(() => this.portfolioService.getCategories()),
        tap(res => this.categories = res)
      )
      .subscribe();

  }
}
