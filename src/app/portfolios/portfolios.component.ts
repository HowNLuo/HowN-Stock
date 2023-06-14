import { Category, Portfolio, CategoryReq } from './../core/interface/portfolio.interface';
import { Component, OnInit, ViewChild } from '@angular/core';

import { PortfolioService } from './../core/service/portfolio.service';
import { NgForm } from '@angular/forms';
import { concatMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';

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
  categroiesEdited: Category[];
  isDragging: boolean = false;
  draggedIndex: number;

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
          // 如果沒有類別，預設「我的」類別
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
  }

  endEditCategories() {
    if(this.categories !== this.categroiesEdited) {
      this.categories = this.categroiesEdited;
      const transformedData = {}
      this.categroiesEdited.map(category => {
        transformedData[category.id] = {
          categoryName: category.categoryName
        };
      })
      this.portfolioService.updateCategories(transformedData)
        .subscribe();
    }
  }

  startEditCategoryName(category: Category) {
    this.editingItem = this.editingName = category.categoryName;
  }

  endEditCategoryName(index: number) {
    this.editingItem = '';
    this.categroiesEdited[index].categoryName = this.editingName;
  }

  deleteCategory(index: number) {
    this.categroiesEdited.splice(index, 1);
  }

  onDragStart(index: number) {
    this.isDragging = true;
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.draggedIndex !== index) {
      const draggedItem = this.categroiesEdited[this.draggedIndex];
      const dragOverItem = this.categroiesEdited[index];
      const cloneDraggedItem = _.cloneDeep(draggedItem);
      draggedItem.id = dragOverItem.id;
      dragOverItem.id = cloneDraggedItem.id;
      this.categroiesEdited.splice(this.draggedIndex, 1);
      this.categroiesEdited.splice(index, 0, draggedItem);
      this.draggedIndex = index;
    };
  }

  onDragEnd() {
    this.isDragging = false;
    this.draggedIndex = null;
  }

  test() {
    console.log(this.categories)
    console.log(this.portfolios)
  }

}
