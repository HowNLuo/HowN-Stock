import { Component, OnInit } from '@angular/core';

import { PortfolioService } from './../core/service/portfolio.service';

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.css']
})
export class PortfoliosComponent implements OnInit {

  constructor(
    private portfolioService: PortfolioService
  ) { }

  ngOnInit() {
    this.portfolioService.getPortfolios()
      .subscribe(res => {
        console.log(res);
      });
  }

}
