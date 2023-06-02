import { HistoricalStocks } from './../core/interface/stock.interface';
import { Component, OnInit } from '@angular/core';

import { mockStocks } from '../shared/mock/stock.mock';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stocksData: HistoricalStocks;
  stockKeyword: string;
  yearAndMonth: string;
  isHovered: boolean;

  constructor() { }

  ngOnInit() {
    this.setCalander();
  }

  /** 設定日期選擇欄位 */
  setCalander() {
    $('.datepicker').datepicker({
      minViewMode: 'months',
      format: 'yyyy-mm',
      autoclose: true
    });
  }

  onSearchClick() {
    this.stocksData = mockStocks;
    setTimeout(() => {
      this.drawChart();
    }, 0);
  }

  toggleHover(hovered: boolean) {
    this.isHovered = hovered;
  }

  drawChart() {
  }

}
