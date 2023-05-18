import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './header/header.component';
import { PortfoliosComponent } from './portfolios/portfolios.component';
import { HomeComponent } from './home/home.component';
import { StockInfoComponent } from './stock-info/stock-info.component';
import { PortfolioComponent } from './portfolios/portfolio/portfolio.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PortfoliosComponent,
    PortfolioComponent,
    HomeComponent,
    StockInfoComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
