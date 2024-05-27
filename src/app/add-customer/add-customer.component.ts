import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  @Output() submitClicked: EventEmitter<void> = new EventEmitter<void>();

  createAndEditForm: FormGroup;
  createsubscriptionForm: FormGroup;
  activeIndex: number = 0;
  visible: boolean = false;
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
  showCustomerDetails: boolean = false;
  showSubscriptionDetails: boolean = false;
  subscriptionData: any[] = [];
  customercodeData: any;
  constructor(private fb: FormBuilder, private router: Router, private apiService: HttpService, private messageService: MessageService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.createSubscriptionDetailsForm();
    this.addSubscriptionForm()
  }
  createForm() {
    this.createAndEditForm = this.fb.group({
      name: ['', [Validators.required, this.validateName]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      country: ['USA', [Validators.required]],
      city: [null, [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: [null, [Validators.required]],
      address1: ['', [Validators.required]],
      address2: [''],
      contactName: [null],
      customerCode: [null, [Validators.required]],
      status: ['A'],
      controllingShipper: ['', [Validators.required]],
      allowAsShipper: [null, [Validators.required]],
      allowAsBillTo: [null, [Validators.required]],
      allowAsLoadAt: [null, [Validators.required]],
      allowAsConsignee: [null, [Validators.required]],
    });
  }
  createSubscriptionDetailsForm() {
    this.createsubscriptionForm = this.fb.group({
      subscriptionType: [null, [Validators.required]],
      controlling: [null, [Validators.required]],
      billTo: [null, [Validators.required]],
      shipper: [null, [Validators.required]],
      trackingRequired: [null],
      transmissionId: [null],
      isAPI: [null],
      apiVersion: [null],
      thirdPartyService: [null],
      customerCode: [this.customercodeData],
      subscriptions: this.fb.array([]),
    });
  }
  getSubscriptionControl(index: number, controlName: string) {
    return this.subscriptionForms.controls[index].get(controlName);
  }
  addCustomer() {
    // this.showCustomerDetails = false;
    // this.showSubscriptionDetails = true;
    // this.router.navigate(['/customer']);
    this.customercodeData = this.createAndEditForm?.value.customerCode
    this.subscriptionForms.controls.forEach((formGroup: FormGroup) => {
      formGroup.patchValue({
        customerCode: this.customercodeData
      });
    });
    const custForm = this.createAndEditForm.value
    if (this.createAndEditForm.invalid) {
      Object.keys(this.createAndEditForm.controls).forEach(formControlName => {
        this.createAndEditForm.get(formControlName).markAsTouched();
      });
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields.' });
    } else {
      const data = {
        "address1": custForm.address1,
        "address2": custForm.address2,
        "city": custForm.city,
        "contactName": custForm.contactName,
        "customerCode": custForm.customerCode,
        "country": "USA",
        "name": custForm.name,
        "phone": custForm.phone,
        "postalCode": custForm.postalCode,
        "state": custForm.state,
        "status": custForm.status,
        "controllingShipper": custForm.controllingShipper,
        "allowAsShipper": custForm.allowAsShipper,
        "allowAsBillTo": custForm.allowAsBillTo,
        "allowAsLoadAt": custForm.allowAsLoadAt,
        "allowAsConsignee": custForm.allowAsConsignee,
      }
      this.apiService.postApi(environment.endPoints.addCustomers, data).subscribe((res) => {
        if (res.success === true) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.message })
          this.showCustomerDetails = false;
          this.showSubscriptionDetails = true;
          // this.createAndEditForm.reset();
        } else {
          this.messageService.add({ severity: "error", summary: "error", detail: res.message });
          this.showCustomerDetails = true;
          this.showSubscriptionDetails = false;
        }
      });
      this.router.navigate(['/customer']);
    }
  }
  goBack(): void {
    this.router.navigate(['/customer']);
  }
  nextStep() {
    if (this.activeIndex < this.steps.length - 1) {
      const controls = this.getControlsForStep(this.activeIndex);
      Object.values(controls).forEach(control => control.markAsTouched());
      const isValidStep = Object.values(controls).every(control =>
        control.valid
      );
      if (isValidStep) {
        this.activeIndex++;
      }
    }
  }
  getControlsForStep(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return {
          name: this.createAndEditForm.get('name'),
          phone: this.createAndEditForm.get('phone'),
          country: this.createAndEditForm.get('country'),
          city: this.createAndEditForm.get('city'),
          state: this.createAndEditForm.get('state'),
          postalCode: this.createAndEditForm.get('postalCode'),
          address1: this.createAndEditForm.get('address1'),
          status: this.createAndEditForm.get('status'),
          contactName: this.createAndEditForm.get('contactName')
        };
      case 1:
        return {
          controllingShipper: this.createAndEditForm.get('controllingShipper'),
          allowAsShipper: this.createAndEditForm.get('allowAsShipper'),
          allowAsBillTo: this.createAndEditForm.get('allowAsBillTo'),
          allowAsLoadAt: this.createAndEditForm.get('allowAsLoadAt'),
          allowAsConsignee: this.createAndEditForm.get('allowAsConsignee'),
          subscriptionType: this.createAndEditForm.get('subscriptionType'),
          controlling: this.createAndEditForm.get('controlling'),
          billTo: this.createAndEditForm.get('billTo'),
          shipper: this.createAndEditForm.get('shipper'),
          transmissionId: this.createAndEditForm.get('transmissionId'),
          isAPI: this.createAndEditForm.get('isAPI'),
          apiVersion: this.createAndEditForm.get('apiVersion'),
          thirdPartyService: this.createAndEditForm.get('thirdPartyService'),
        };
      default:
        return {};
    }
  }

  prevStep() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }
  get subscriptionForms() {
    return this.createsubscriptionForm.get('subscriptions') as FormArray;
  }
  removeSubscription(index: number) {
    this.subscriptionForms.removeAt(index);
    this.isInitialForm.splice(index, 1);
}
  addSubscriptionForm() {
    const subscriptionForm = this.fb.group({
      subscriptionType: [null],
      controlling: [null],
      billTo: [null],
      shipper: [null],
      trackingRequired: [null],
      transmissionId: [null],
      isAPI: [null],
      apiVersion: [null],
      thirdPartyService: [null],
      customerCode: [this.customercodeData]
    });
    this.subscriptionForms.push(subscriptionForm);
  }
  onSubmit() {
    const data = this.subscriptionForms.value;
    this.apiService.postApi(environment.endPoints.addSubscriptionDetails, data).subscribe((res) => {
      if (res.success === true) {
        this.messageService.add({ severity: "success", summary: "Success", detail: res.message })
      } else {
        this.messageService.add({ severity: "error", summary: "error", detail: res.message });
      }
    })
    this.createAndEditForm.reset()
    this.submitClicked.emit();
  }
  resetForm() {
    this.showCustomerDetails = true;
    this.showSubscriptionDetails = false;
    this.createAndEditForm.reset();
    this.createsubscriptionForm.reset();
  }
  searchCustomers(event: any) {
    const customerCode = event.target.value;
    this.apiService.getApi(environment.endPoints.customerCodeExists + '?customerCode=' + customerCode).subscribe({
      next:(res: any) => {
        if (res.success === true) {
          this.createAndEditForm.get('customerCode')?.setErrors({ 'incorrect': true });
        } else {

        }
      },
      error:(error: any) => {
        this.createAndEditForm.get('customerCode')?.setErrors({ 'incorrect': true });
      }
    }
    );
  }
  validateName(control: any) {
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(control.value)) {
      return { invalidName: true };
    }
    return null;
  }
}