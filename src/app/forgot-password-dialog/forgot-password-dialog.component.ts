import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
import {  DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss'],
  providers: [DynamicDialogRef]

})
export class ForgotPasswordDialogComponent implements OnInit {
  resetPassword: FormGroup;
  @Output() resetPasswordSuccess: EventEmitter<any> = new EventEmitter();
  password1=''
  passwordVisible: boolean = false;
          
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  constructor(private fb:FormBuilder,private forgotPasswordService:HttpService,private ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.resetPassword = this.fb.group({
      emailId: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$")]],
    });
  }
  signIn(): void {
    if (this.resetPassword.invalid) {
      Object.keys(this.resetPassword.controls).forEach(formControlName => {
        this.resetPassword.get(formControlName).markAsTouched();
      });
      return;
    }
    this.forgotPasswordService.submit(this.resetPassword.value)
    this.ref.close();
  }
}
