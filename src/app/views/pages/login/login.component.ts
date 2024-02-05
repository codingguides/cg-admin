import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpCallService } from '../../../common/http-call.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formGroup;
  url: string;
  isSubmitted: boolean = false;
  isErrorMessage: any = false;
  errorMessage: any = '';

  constructor(
    public commonservice: HttpCallService,
    private formBuilder: FormBuilder,
    private _router: Router,
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) {
    this.checkLoggedIn();
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(32),
        ]),
      ],
    });
    this.url = `${environment.apiURL}/api/`;
  }
  get email() {
    return this.formGroup.get('email');
  }

  get password() {
    return this.formGroup.get('password');
  }

  checkLoggedIn() {
    // console.log('sessionStorage.getItem(status)>>>>>>>>>>>>', sessionStorage.getItem('status'))
    if (sessionStorage.getItem('status') === 'LoggedIn') {
      this._router.navigate(['./dashboard']);
    }
  }

  async onSubmit(formData: any) {
    this.isSubmitted = true;
    if (this.formGroup.valid == true) {
      const email = formData['email'];
      const password = formData['password'];

      await this.commonservice
        .login(
          {
            email: email,
            password: password,
          },
          'user/login'
        )
        .subscribe((res) => {
          this.isErrorMessage = false;
          const apiResult = JSON.parse(JSON.stringify(res));

          if (apiResult['result'] == 'ok') {
            if (apiResult && apiResult['data']['payload']) {
              localStorage.clear();
              console.log(apiResult && apiResult['data']['token']);
              localStorage.setItem(
                'accessToken',
                apiResult && apiResult['data']['token']
              );
              sessionStorage.setItem(
                'accessToken',
                apiResult && apiResult['data']['token']
              );
              // window.location.href = `${environment.siteURL}/#/dashboard`;
              this._router.navigate(['./dashboard']);
            } else {
              this.isErrorMessage = true;
              this.errorMessage = apiResult['message'];
            }
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Login Successful',
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            apiResult.errors.map((err: object) => {
              const error = JSON.parse(JSON.stringify(err));
              this.toastr.error(error['msg'], 'LOGIN', { timeOut: 5000 });
            });
          }
        });
    }
  }
}
