import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {
  action: string;
  createAndEditForm: FormGroup;
  createsubscriptionForm: FormGroup;
  activeIndex: number = 0;
  showCustomerDetails: boolean = false;
  showSubscriptionDetails: boolean = false;
  subscriptionData: any[] = [];
  isInitialForm: boolean[] = [true];

  steps = [
    { label: 'Customer Details' },
    { label: 'Subscription Details' },
    // { label: 'Additional Subscription Details' },

    // Add more steps as needed
  ];
  country = [
    { name: 'USA', code: 'USA' }
  ]
  yesOrNo = [
    { name: 'Yes', code: 'Y' },
    { name: 'No', code: 'N' }
  ]
  statusOptions = [
    { name: "ACTIVE", code: "A" },
    { name: "INACTIVE", code: "I" },
  ];
  vendors = [
    { label: 'FK', value: 'FourKite/Firestone' },
    { label: 'TF', value: 'TenFour' },
    { label: 'AP', value: 'Mercer API(Project 44)' },
    { label: 'MP', value: 'Macropoint' }
  ]
  customerData: any;
  subscriptionDetailsData: any;
  constructor(private fb: FormBuilder, private router: Router, private apiService: HttpService, private messageService: MessageService, private route: ActivatedRoute) {
    this.createForm();
    this.route.queryParams.subscribe(params => {
      this.action = params['action'];
    });
  }

  ngOnInit(): void {
    this.setcreateAndEditForm();
    this.setcreatesubscriptionForm();
    this.createSubscriptionDetailsForm();
    this.addSubscriptionForm()
    console.log(this.createsubscriptionForm.controls.apiVersion.invalid,'createsubscriptionForm');

    // this.createsubscriptionForm = this.fb.group({
    //   subscriptionsData: this.fb.array([this.createSubscriptionFormGroup()])
    // });
  }

  trackingOptions: SelectItem[] = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];
  createForm() {
    this.createAndEditForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: [null],
      status: ['', Validators.required],
      postalCode: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      contactName: [null],
      customerCode: ['', Validators.required],
      controllingShipper: [null, Validators.required],
      allowAsShipper: [null, [Validators.required]],
      allowAsBillTo: [null, [Validators.required]],
      allowAsLoadAt: [null, [Validators.required]],
      allowAsConsignee: [null, [Validators.required]],
    });
    this.customerData = JSON.parse(localStorage.getItem('editCustomerData'))
  }
  createSubscriptionDetailsForm() {
    this.createsubscriptionForm = this.fb.group({
      id: [null],
      subscriptionType: [null, [Validators.required]],
      controlling: [null, [Validators.required]],
      billTo: [null, [Validators.required]],
      shipper: [null, [Validators.required]],
      trackingRequired: [null],
      transmissionId: [null],
      isAPI: [null],
      apiVersion: [null],
      thirdPartyService: [null],
      customerCode: [null],
      subscriptionsData: this.fb.array([]),
    });
  }
  createSubscriptionFormGroup(): FormGroup {
    return this.fb.group({
      subscriptionType: [null, [Validators.required]],
      controlling: [null, [Validators.required]],
      billTo: [null, [Validators.required]],
      shipper: [null, [Validators.required]],
      trackingRequired: [null],
      transmissionId: [null],
      isAPI: [null],
      apiVersion: [null],
      thirdPartyService: [null],
      customerCode: [null],
    });
  }
  setcreateAndEditForm() {
    this.createAndEditForm.patchValue({ ...this.customerData });
  }
  updateCustomer() {
    const custForm = this.createAndEditForm.value
    if (this.createAndEditForm.invalid) {
      Object.keys(this.createAndEditForm.controls).forEach(formControlName => {
        this.createAndEditForm.get(formControlName).markAsTouched();
      });
    } else {
      const data = {
        "id": this.customerData.id,
        "address1": custForm.address1,
        "address2": custForm.address2,
        "allowAsBillTo": custForm.allowAsBillTo,
        "allowAsConsignee": custForm.allowAsConsignee,
        "allowAsLoadAt": custForm.allowAsLoadAt,
        "allowAsShipper": custForm.allowAsShipper,
        "city": custForm.city,
        "contactName": custForm.contactName,
        "controllingShipper": custForm.controllingShipper,
        "country": custForm.country,
        "customerCode": custForm.customerCode,
        "name": custForm.name,
        "phone": custForm.phone,
        "postalCode": custForm.postalCode,
        "state": custForm.state,
        "status": custForm.status,
      }
      this.apiService.putApi(environment.endPoints.updateCustomer, data).subscribe((res) => {
        if (res.success === true) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.message })
          this.createAndEditForm.reset();
        } else {
          this.messageService.add({ severity: "error", summary: "error", detail: res.message });
        }
      })
    }
  }
  goBack(): void {
    // Use the Router service to navigate to the desired page
    this.router.navigate(['/customer']); // Replace 'desired-page' with the route of the page you want to navigate to
  }

  nextStep() {
    if (this.activeIndex < this.steps.length - 1) {
      this.activeIndex++;
    }
  }

  prevStep() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  addSubscriptionSubmit() {
    const data = this.subscriptionForms.value;
    this.apiService.postApi(environment.endPoints.addSubscriptionDetails, data).subscribe((res) => {
      if (res.success === true) {
        this.messageService.add({ severity: "success", summary: "Success", detail: res.message })
        this.showCustomerDetails = false;
        this.showSubscriptionDetails = true;
        this.createAndEditForm.reset();
      } else {
        this.messageService.add({ severity: "error", summary: "error", detail: res.message });
        this.showCustomerDetails = true;
        this.showSubscriptionDetails = false;
      }
    })
    this.router.navigate(['/customer'])
  }

  get subscriptionForms() {
    return this.createsubscriptionForm?.get('subscriptionsData') as FormArray;
  }
  setcreatesubscriptionForm() {
    const data = this.customerData?.customerCode;
    if (this.action === 'editSubscription') {
      this.apiService.getApi(environment.endPoints.getSubscriptionDetails + '?customerCode=' + data).subscribe((res) => {
        this.subscriptionData = res.body;
        this.subscriptionForms.clear();
        this.subscriptionData.forEach(subscription => {
          const subscriptionForm = this.fb.group({
            id: [subscription.id],
            subscriptionType: [subscription.subscriptionType],
            controlling: [subscription.controlling],
            billTo: [subscription.billTo],
            shipper: [subscription.shipper],
            trackingRequired: [subscription.trackingRequired],
            transmissionId: [subscription.transmissionId],
            isAPI: [subscription.isAPI],
            apiVersion: [subscription.apiVersion],
            thirdPartyService: [subscription.thirdPartyService],
            customerCode: [subscription.customerCode]
          });
          this.subscriptionForms.push(subscriptionForm);
        });
      });
    }
  }

  addSubscriptionForm() {
    const subscriptionForm = this.fb.group({
      subscriptionType: [null, [Validators.required]],
      controlling: [null, [Validators.required]],
      billTo: [null, [Validators.required]],
      shipper: [null, [Validators.required]],
      trackingRequired: [null],
      transmissionId: [null],
      isAPI: [null],
      apiVersion: [null],
      thirdPartyService: [null],
      customerCode: [this.customerData?.customerCode]
    });
    this.subscriptionForms.push(subscriptionForm);
  }
  updateSubscription() {
    // if (this.createsubscriptionForm.invalid) {
    //   this.markFormGroupTouched(this.createsubscriptionForm);
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields.' });
    // }
    // else {
    const custForm = this.subscriptionForms.value;
    console.log(custForm, 'custForm')
    this.apiService.putApi(environment.endPoints.updateSubscriptionDetails, custForm).subscribe((res) => {
      if (res.success === true) {
        this.messageService.add({ severity: "success", summary: "Success", detail: res.message })
        this.createAndEditForm.reset();
      } else {
        this.messageService.add({ severity: "error", summary: "error", detail: res.message });
      }
    });
    this.router.navigate(['/customer']);
    // }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(ctrl => this.markFormGroupTouched(ctrl as FormGroup));
      }
    });
  }
  removeSubscription(index: number) {
    this.subscriptionForms.removeAt(index);
    this.isInitialForm.splice(index, 1);
  }
  getSubscriptionControl(index: number, controlName: string) {
    return this.subscriptionForms.controls[index].get(controlName);
  }

  validateName(control: any) {
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(control.value)) {
      return { invalidName: true };
    }
    return null;
  }
  searchCustomers(event: any) {
    const customerCode = event.target.value;
    this.apiService.getApi(environment.endPoints.customerCodeExists + '?customerCode=' + customerCode).subscribe({
      next: (res: any) => {
        if (res.success !== true) {
        } else {
          this.createAndEditForm.get('customerCode')?.setErrors({ 'incorrect': true });
        }
      },
      error: (error: any) => {
        this.createAndEditForm.get('customerCode')?.setErrors({ 'incorrect': true });
      }
    }
    );
  }

  get formST() {
    return this.createsubscriptionForm.controls;
  }
}
