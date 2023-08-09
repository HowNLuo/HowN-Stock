import { Component, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modalDialog.component.html',
  styleUrls: ['./modalDialog.component.scss']
})
export class ModalDialogComponent implements AfterViewInit {
  message: string;
  type: string;
  title: string;

  constructor(public modalRef: BsModalRef) { }

  ngAfterViewInit(): void {
      switch (this.type) {
        case 'error':
          this.title = '錯誤訊息';
          break;
        case 'alert':
          this.title = '提示訊息';
          break;
        default:
          break;
      }
  }


}
