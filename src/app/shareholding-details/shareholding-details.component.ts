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
  chart: Chart

  // 加載中
  get isLoading(): boolean { return this.loadingService.isLoading; }

  get shareholdingSum() {
    let result = [];
    this.shareHoldingDetail.forEach(detail => {
      const existingDetail = result.find(r => r.stockId === detail.stockId);
      if(existingDetail) {
        existingDetail.cost += detail.dealPrice * detail.stockUnits;
      } else {
        result.push({
          stockId: detail.stockId,
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
            this.calcTotalAmount(res);
            this.drawChart();
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
        this.calcTotalAmount(this.shareHoldingDetail);
        this.drawChart();
      });
  }

  calcTotalAmount(shareholding: Shareholding[]) {
    this.totalAcount = shareholding.map(detail => detail.dealPrice * detail.stockUnits).reduce((a, b) => a + b, 0);
  }

  drawChart() {
    const canvas = document.getElementById('chart') as HTMLCanvasElement;
    if(this.chart) {
      this.chart.destroy();
    }
    if(canvas) {
      const ctx = canvas.getContext('2d');

      const colors = ['#9F35FF','#BE77FF','#D3A4FF','#DCB5FF','#E6CAFF',];
      const backgroundColors = [];
      this.shareholdingSum.forEach((r,i) => {
        const color = colors[i % colors.length];
        backgroundColors.push(color);
      })

      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.shareholdingSum.map(r => r.stockId),
          datasets: [{
            data: this.shareholdingSum.map(r => r.cost),
            backgroundColor: backgroundColors,
            hoverBackgroundColor: backgroundColors
          }]
        },
        options: {
          responsive: true
        }
      })
    }
  }

  test() {
    console.log(this.shareHoldingDetail)
    console.log(this.shareholdingSum)
    console.log(this.form)
  }
}
