import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  selectedValue: any
 
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
  customerDetails: FormGroup;
  customerData: any;
  radiovalue: any;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.customerDetails = this.fb.group({
      name: [''],
      phone: [''],
      country: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      address1: [''],
      address2: [''],
      contactName: [''],
      controllingShipper: [''],
      allowAsShipper: [''],
      allowAsBillTo: [''],
      allowAsLoadAt: [''],
      allowAsConsignee: [''],
      subscriptionType: [''],
      controlling: [''],
      billTo: [''],
      shipper: [''],
      trackingRequired: [''],
      transmissionId: [''],
      isAPI: [''],
      apiVersion: [''],
      thirdPartyService: ['']
    });

    this.setCustomerDetails();
  }
  goBack() {
    this.router.navigate(['/customer'])
  }
  setCustomerDetails() {
    const customerData = JSON.parse(localStorage.getItem('customerData'))

    this.customerDetails.controls.name.patchValue(customerData.name);
    this.customerDetails.controls.phone.patchValue(customerData.phone);

    const selectedcountry= this.country.find(option => option.code === customerData.country);
    this.customerDetails.controls.country.patchValue(selectedcountry ? selectedcountry.name : '');
    this.customerDetails.controls.city.patchValue(customerData.city);
    this.customerDetails.controls.state.patchValue(customerData.state);
    this.customerDetails.controls.postalCode.patchValue(customerData.postalCode);
    this.customerDetails.controls.address1.patchValue(customerData.address1);
    this.customerDetails.controls.address2.patchValue(customerData.address2);
    this.customerDetails.controls.contactName.patchValue(customerData.contactName);
    this.customerDetails.controls.controllingShipper.patchValue(customerData.controllingShipper);
    // this.customerDetails.get('allowAsShipper').patchValue(this.yesOrNo.filter(x => x.code === this.customerData.allowAsShipper))

    const selectedOption = this.yesOrNo.find(option => option.code === customerData.allowAsShipper);
    const selectedName = selectedOption ? selectedOption.name : '';
    this.customerDetails.controls.allowAsShipper.patchValue(selectedName);

    const selectedAllowShipper = this.yesOrNo.find(option => option.code === customerData.allowAsBillTo);
    this.customerDetails.controls.allowAsBillTo.patchValue(selectedAllowShipper ? selectedAllowShipper.name : '');

    const selectedallowAsBillTo = this.yesOrNo.find(option => option.code === customerData.allowAsLoadAt);
    this.customerDetails.controls.allowAsLoadAt.patchValue(selectedallowAsBillTo ? selectedallowAsBillTo.name : '');

    const selectedallowAsConsignee = this.yesOrNo.find(option => option.code === customerData.allowAsConsignee);
    this.customerDetails.controls.allowAsConsignee.patchValue(selectedallowAsConsignee ? selectedallowAsConsignee.name : '');

    const selectedsubscriptionType = this.vendors.find(option => option.label === customerData.subscriptionType);
    this.customerDetails.controls.subscriptionType.patchValue(selectedsubscriptionType ? selectedsubscriptionType.value: '');

    const selectedcontrolling = this.yesOrNo.find(option => option.code === customerData.controlling);
    this.customerDetails.controls.controlling.patchValue(selectedcontrolling ? selectedcontrolling.name : '');

    const selectedbillTo = this.yesOrNo.find(option => option.code === customerData.billTo);
    this.customerDetails.controls.billTo.patchValue(selectedbillTo ? selectedbillTo.name : '');

    const selectedshipper = this.yesOrNo.find(option => option.code === customerData.shipper);
    this.customerDetails.controls.shipper.patchValue(selectedshipper ? selectedshipper.name :'');

    const selectedtrackingReq = this.yesOrNo.find(option => option.code === customerData.trackingRequired);
    this.customerDetails.controls.trackingRequired.patchValue(selectedtrackingReq ? selectedtrackingReq.name : '');

    const selectedisApi = this.yesOrNo.find(option => option.code === customerData.isApi);
    this.customerDetails.controls.isAPI.patchValue(selectedisApi ? selectedisApi.name : '');
    this.customerDetails.controls.transmissionId.patchValue(customerData.transmissionId);
    this.customerDetails.controls.apiVersion.patchValue(customerData.apiVersion);
    this.customerDetails.controls.thirdPartyService.patchValue(customerData.thirdPartyService);
  }

}
