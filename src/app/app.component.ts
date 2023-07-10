import { AuthService } from './core/service/auth.service';
import { LoadingService } from './core/service/loading.service';
import { Component, AfterContentChecked, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentChecked, OnInit{
  isLoading: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.autoLogin();
  }

  ngAfterContentChecked(): void {
      this.isLoading = this.loadingService.isLoading;
  }

}
