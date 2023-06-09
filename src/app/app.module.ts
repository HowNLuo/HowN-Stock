import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http'
import { DatePipe } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { PortfoliosComponent } from './portfolios/portfolios.component';
import { HomeComponent } from './home/home.component';
import { StockInfoComponent } from './stock-info/stock-info.component';
import { PortfolioComponent } from './portfolios/portfolio/portfolio.component';
import { UserStocksDetailComponent } from './user-stocks-detail/user-stocks-detail.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PortfoliosComponent,
    PortfolioComponent,
    HomeComponent,
    StockInfoComponent,
    UserStocksDetailComponent
   ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
