import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingStatus: boolean = false;

  constructor() { }

  get isLoading(): boolean { return this.loadingStatus; }

  show() {
    this.loadingStatus = true;
  }

  hide() {
    this.loadingStatus = false;
  }

}
