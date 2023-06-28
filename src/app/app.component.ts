import { LoadingService } from './core/service/loading.service';
import { Component, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentChecked{
  isLoading: boolean = false;

  constructor(
    private loadingService: LoadingService
  ) {}

  ngAfterContentChecked(): void {
      this.isLoading = this.loadingService.isLoading;
  }

}
