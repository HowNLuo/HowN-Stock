import { HistoricalStocks } from './../core/interface/stock.interface';
import { Component, OnInit } from '@angular/core';

import { mockStocks } from '../shared/mock/stock.mock';

import * as Chart from 'chart.js';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stocksData: HistoricalStocks; // 股票搜尋結果
  stockKeyword: string;         // 搜尋關鍵字
  yearAndMonth: string;         // 欲查詢月份
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

  /** 繪製折線圖 */
  drawChart() {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    let xArray = [];
    let yArray = [];
    this.stocksData.data.forEach(stockData => {
      xArray.push(stockData[0].slice(-5))
      yArray.push(stockData[6])
    })

    const data = {
      labels: xArray,
      datasets: [{
        label: '4月份股價歷史紀錄',
        data: yArray,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {}
    });
  }

}
