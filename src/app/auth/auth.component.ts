import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { LoadingService } from './../core/service/loading.service';
import { AuthRes, AuthService } from './../core/service/auth.service';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.loadingService.show();
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthRes>;

    if(this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe(() => {
      this.loadingService.hide();
      this.router.navigate(['/home']);
    });

    form.reset();
  }
}
