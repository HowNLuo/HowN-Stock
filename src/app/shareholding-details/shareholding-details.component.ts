import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Shareholding } from './../core/interface/shareholding.interface';
import { LoadingService } from './../core/service/loading.service';
import { StockService } from './../core/service/stock.service';
import { TaiwanStockInfo } from './../core/interface/stock.interface';
import { ShareholdingService } from './../core/service/shareholding.service';

import {tap} from 'rxjs/operators'
import Chart from 'chart.js'

@Component({
  selector: 'app-shareholding-details',
  templateUrl: './shareholding-details.component.html',
  styleUrls: ['./shareholding-details.component.scss']
})
export class ShareholdingDetailsComponent implements OnInit {
  form: FormGroup;
  shareHoldingDetail: Shareholding[] = [];
  stocksInfo: TaiwanStockInfo[];
  totalAcount: number;
  chart: Chart;
  displayMode: 'sum' | 'detail' = 'sum';
  selectedSortOption: string = 'dateDrop';
  sortStatus = {
    stockId: true,
    date: false
  };

  // 加載中
  get isLoading(): boolean { return this.loadingService.isLoading; }

  get shareHoldingSum() {
    let result = [];
    this.shareHoldingDetail.forEach(detail => {
      const existingDetail = result.find(r => r.stockId === detail.stockId);
      if(existingDetail) {
        existingDetail.cost += detail.dealPrice * detail.stockUnits;
        existingDetail.stockUnits += detail.stockUnits;
      } else {
        result.push({
          stockId: detail.stockId,
          stockUnits: detail.stockUnits,
          cost: detail.dealPrice * detail.stockUnits
        });
      }
    })
    return result;
  }

  constructor(
    private shareholdingService: ShareholdingService,
    private stockService: StockService,
    private loadingService: LoadingService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    this.loadingService.show();
    this.shareholdingService.getShareholding()
      .pipe(
        tap(res => {
          if(res.length > 0) {
            this.shareHoldingDetail = res;
            this.calcTotalAmount();
            this.drawChart();
            this.sortColumn();
          }
          this.loadingService.hide()
        })
      )
      .subscribe();
  }

  buildForm() {
    this.form = this.fb.group({
      stockId: ['', Validators.required],
      date: ['', Validators.required],
      stockUnits: ['', [Validators.required, Validators.min(1)]],
      dealPrice: ['', [Validators.required, Validators.min(1)]]
    })
  }

  startAddShareholding() {
    this.form.reset();
    if(!this.stocksInfo) {
      this.loadingService.show()
      this.stockService.getTaiwanStockInfo()
        .subscribe(res => {
          this.stocksInfo = res.data;
          this.loadingService.hide();
        });
    }
  }

  onAddShareholdingSubmit(req) {
    this.shareholdingService.addShareholding(req)
      .pipe(
        tap(() => this.shareHoldingDetail.push(req))
      )
      .subscribe(() => {
        this.calcTotalAmount();
        this.drawChart();
      });
  }

  calcTotalAmount() {
    this.totalAcount = this.shareHoldingDetail.map(detail => detail.dealPrice * detail.stockUnits).reduce((a, b) => a + b, 0);
  }

  drawChart() {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    if(this.chart) {
      this.chart.destroy();
    }
    if(canvas) {
      const ctx = canvas.getContext('2d');
      const colors = ['#F43545','#FF8901','#FAD717','#00BA71','#00C2DE','#00418D','#5F2879'];
      const backgroundColors = [];

      this.shareHoldingSum.forEach((r,i) => {
        const color = colors[i % colors.length];
        backgroundColors.push(color);
      })
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.shareHoldingSum.map(r => r.stockId),
          datasets: [{
            data: this.shareHoldingSum.map(r => r.cost),
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors
          }]
        },
        options: {
          responsive: true,
          legend: {
            position: 'left'
          }
        }
      })
    }
  }

  sortColumn() {
    switch (this.selectedSortOption) {
      case 'stockIdRise':
        this.shareHoldingDetail.sort((a, b) => a.stockId.localeCompare(b.stockId));
        break;
      case 'stockIdDrop':
        this.shareHoldingDetail.sort((a, b) => b.stockId.localeCompare(a.stockId));
        break;
      case 'dateRise':
        this.shareHoldingDetail.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'dateDrop':
        this.shareHoldingDetail.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      default:
        // 預設排序方式
        break;
    }
  }

  switchDisplayMode(mode: 'sum' | 'detail') {
    this.displayMode = mode;
  }

  deleteShareHoldingDetail(id: string) {
    this.loadingService.show();
    this.shareholdingService.deleteShareholding(id)
      .subscribe(() => {
        this.loadingService.hide();
        this.shareHoldingDetail = this.shareHoldingDetail.filter(res => res.id !== id);
        this.calcTotalAmount();
        this.drawChart();
      });
  }

  test() {
    console.log(this.shareHoldingDetail)
    console.log(this.shareHoldingSum)
    console.log(this.form)
  }
}
