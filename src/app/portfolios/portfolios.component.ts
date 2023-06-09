import { Component, OnInit, ViewChild } from '@angular/core';

import { PortfolioService } from './../core/service/portfolio.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss']
})
export class PortfoliosComponent implements OnInit {
  @ViewChild('f') form: NgForm;

  constructor(
    private portfolioService: PortfolioService,
  ) { }

  ngOnInit() {
    this.portfolioService.getPortfolios()
      .subscribe(res => {
        console.log(res);
      });
    this.portfolioService.getCategory()
      .subscribe(res => {
        console.log(res)
      })
  }

  onCategoryNameSubmit() {

  }
}
