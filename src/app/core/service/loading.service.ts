import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingStatus = false;

  constructor() { }

  get isLoading(): boolean { return this.loadingStatus; }

  show() {
    this.loadingStatus = true;
  }

  hide() {
    this.loadingStatus = false;
  }

}
