import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  providers: [DialogService, DynamicDialogRef]
})
export class AppLoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisible: boolean = false;
  resetpasswordAPICall: boolean = false;
  showPassword: boolean;
  emailId: any

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  // ref: import("primeng/dynamicdialog").DynamicDialogRef;
  constructor(private route: Router, private ref: DynamicDialogRef, private dialogService: DialogService, private api: HttpService, private fb: FormBuilder,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: '',
      password: '',
    });
  }

  // signIn(data: any) {
  //   const params = {
  //     loginId: data.username,
  //     password: data.password
  //   };
  //   this.api.postApi(environment.endPoints.login, params, { observe: 'response' }).subscribe({
  //     next: (res) => {
  //       const authorizationHeader = res.headers.get('Authorization');
  //       sessionStorage.setItem('token', authorizationHeader)

  //       if (res?.body?.success === true) {
  //         this.route.navigate(['/piechart']);
  //       } else {
  //         this.messageService.add({ severity: "error", summary: "Error", detail: "Invalid loginId or password !" });
  //       }
  //     },
  //     error: (error: any) => {
  //       console.log(error?.body?.message, 'err')
  //       this.messageService.add({ severity: "error", summary: "Error", detail: 'Invalid loginId or password !' });
  //     }
  //   }
  //   );
  // }
  signIn(data: any) {
    const params = {
      loginId: data.username,
      password: data.password
    };

    this.api.postApi(environment.endPoints.login, params, { observe: 'response' }).subscribe({
      next: (res) => {
        const authorizationHeader = res.headers.get('Authorization');
        sessionStorage.setItem('token', authorizationHeader);

        if (res?.body?.success === true) {
          
          this.route.navigate(['/piechart']);
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: "Invalid loginId or password!" });
        }
      },
      error: (error: any) => {
        console.log(error?.body?.message, 'err');
        this.messageService.add({ severity: "error", summary: "Error", detail: 'Invalid loginId or password!' });
      }
    });
  }

  openResetPasswordDialog() {
    this.showPassword = true;
    this.emailId = ''
  }
  submitData() {
    const emailId = this.emailId;
    this.api.getApi(environment.endPoints.forgotpassword + '?emailId=' + emailId).subscribe((response) => {
      if (response.success === true) {
        this.messageService.add({ severity: "success", summary: "Success", detail: response.message });
        this.showPassword = false
      }
      else {
        this.messageService.add({ severity: "error", summary: "Error", detail: response.message });
      }
    })
  }
}
