import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  createForm: FormGroup;
  changePasswordForm: FormGroup;
  passwordVisible: boolean = false;
  activeTabIndex: number = 0;
  oldPassword: any
  newPassword: any
  options: any
  roles: any[] = [
    { label: 'Admin', value: "1" },
    { label: 'User', value: "2" }
  ];

  constructor(private fb: FormBuilder, private apiService: HttpService, private messageService: MessageService) {
    this.createAboutForm()
    this.changePassword()
  }

  ngOnInit(): void {
    let profileData = this.apiService.getDecodedTokenPayload()
    this.apiService.getApi(environment.endPoints.getUsers + profileData.id).subscribe((res) => {
      if (res.success === true) {
        this.createForm.patchValue(res.user)
        // this.messageService.add({ severity: "success", summary: "Success", detail: res.message });
      }
      else{
        this.messageService.add({ severity: "error", summary: "error", detail: res.message });
      }
    })
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  createAboutForm() {
    this.createForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      role: ['', [Validators.required]]
    })
  }
  changePassword() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    })
  }

  handleChange(event) {
    this.activeTabIndex = event.index;
    if (this.activeTabIndex === 1) {
      this.changePasswordForm.reset();
    }
  }
  updatePassword(data: any) {
    let profileData = this.apiService.getDecodedTokenPayload()
    const params = {
      emailId: profileData.emailId,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    if (this.changePasswordForm.invalid) {
      Object.keys(this.changePasswordForm.controls).forEach(formControlName => {
        this.changePasswordForm.get(formControlName).markAsTouched();
      });
    }
    else {
      this.apiService.postApi(environment.endPoints.resetPassword, params).subscribe((response) => {
        if (response.success === true) {
          this.messageService.add({ severity: "success", summary: "Success", detail: response.message });
          this.activeTabIndex = 0;
        }
        else {
          this.messageService.add({ severity: "error", summary: "Error", detail: response.message });
        }
      })
    }
  }
  updateUsers() {
    let profileData = this.apiService.getDecodedTokenPayload()
    if (this.createForm.invalid) {
      Object.keys(this.createForm.controls).forEach(formControlName => {
        this.createForm.get(formControlName).markAsTouched();
      });
    } else {
      const data = {
        "firstName": this.createForm.controls.firstName.value,
        "lastName": this.createForm.controls.lastName.value,
        "emailId": this.createForm.controls.emailId.value,
        "phoneNumber": this.createForm.controls.phoneNumber.value,
        "role": this.createForm.controls.role.value
      }
      this.apiService.putApi(environment.endPoints.updateUser + profileData.id, data).subscribe((res) => {
        if (res.success === true) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.message });
        }
        else{
          this.messageService.add({ severity: "error", summary: "Error", detail: res.message });
        }
      })
    }
  }
  get formCP() {
    return this.changePasswordForm.controls;
  }
}
