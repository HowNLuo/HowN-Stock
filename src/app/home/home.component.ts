import { HistoricalStocks } from './../core/interface/stock.interface';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

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

  constructor(
    private http: HttpClient
  ) { }

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
  }

  toggleHover(hovered: boolean) {
    this.isHovered = hovered;
  }
}
