import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http'
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { PortfoliosComponent } from './portfolios/portfolios.component';
import { HomeComponent } from './home/home.component';
import { StockInfoComponent } from './stock-info/stock-info.component';
import { ShareholdingDetailsComponent } from './shareholding-details/shareholding-details.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PortfoliosComponent,
    HomeComponent,
    StockInfoComponent,
    ShareholdingDetailsComponent,
    AuthComponent
   ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot()
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
