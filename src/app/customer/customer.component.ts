import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { TabView } from 'primeng/tabview';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { environment } from 'src/environments/environment';


interface TrackingUpdate {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  contactName: string;
  status: string;
  controllingShipper: string;
  allowAsShipper: string;
  allowAsBillTo: string;
  allowAsLoadAt: string;
  allowAsConsignee: string;
  subscriptionType: string;
  controlling: string;
  billTo: string;
  shipper: string;
  trackingRequired: string;
  transmissionId: string;
  isAPI: string;
  apiVersion: string;
  thirdPartyService: string;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  @ViewChild('tabView') tabView: TabView;
  @ViewChild(AddCustomerComponent) addCustomerComponent: AddCustomerComponent;
  filteredData: TrackingUpdate[] = [];
  totalRecords: number = 0;
  showDialog: boolean = false;
  createAndEditForm: FormGroup;
  activeTabIndex: number = 0;
  selectedUser: TrackingUpdate | null = null;
  rowData: any;
  items: { label: string; icon: string; command: () => void; }[];
  customerForm: FormGroup
  pageNo: number = 0;
  pageSize: number = 10;
  first: number;
  country = [
    { name: 'USA', code: 'USA' }
  ]
  didSearch = false;
  status: any[] = [
    { value: 'In Active' },
    { value: 'Active' }
  ];
  cols = [
    { field: 'name', header: 'Customer Name' },
    { field: "subscriptionType", header: "Subscription Type" },
    { field: 'phone', header: 'Phone Number' },
    { field: 'country', header: 'Country' },
    { field: 'postalCode', header: 'Postal Code' },
    { field: "", header: "Action" },
  ];
  customerData: any = [];
  count: any;
  customersList: any = [];
  showSearchTab: boolean = true;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: HttpService) { }
  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      name: [],
      country: [],
      postalCode: []
    })
    this.createForm();
    // this.getAndSearchCustomer()
  }
  handleChange(event) {
    this.activeTabIndex = event.index;
    this.didSearch = false
    if (this.activeTabIndex === 1) {
      this.addCustomerComponent.resetForm();
    }
  }
  handleAddCustomerSubmit() {
    this.activeTabIndex = 0;
  }
  getAndSearchCustomer() {
    this.didSearch = true;
    const customerName = this.customerForm.controls.name.value ?? ''
    const customerCountry = this.customerForm.controls.country.value ?? ''
    const customerPostalCode = this.customerForm.controls.postalCode.value ?? ''
    this.apiService.getApi(environment.endPoints.getCustomers + '?name=' + customerName + '&country=' + customerCountry + '&postalCode=' + customerPostalCode + '&page=' + this.pageNo + '&size=' + this.pageSize).subscribe((res) => {
      this.customerData = res.customers
      this.count = res.totalCount
    })
  }

  paginate(event) {
    const { page, rows } = event;
    if (![page, rows].every((param, index) => param === [this.pageNo, this.pageSize][index])) {
      this.pageNo = page;
      this.pageSize = rows;
      this.getAndSearchCustomer();
    }
  }

  reset() {
    this.customerForm.reset();
    this.getAndSearchCustomer();
    this.didSearch = false;
  }
  edit(data) {
    this.router.navigate(['/edit'], { queryParams: { action: 'editSubscription' } });
    localStorage.setItem('editCustomerData', JSON.stringify(data))
  }
  eidtSubscriptionData(data) {
    this.router.navigate(['/edit'], { queryParams: { action: 'showAddSubscription' } });
    // localStorage.setItem('editSubscriptionData', JSON.stringify(data));
  }
  
  viewCutomersData(data) {
    this.router.navigate(['/customer-details'])
    localStorage.setItem('customerData', JSON.stringify(data))
  }
  openEditDialog(data: TrackingUpdate): void {
    // Assign the selected user for editing
    this.selectedUser = data;
    // Populate the form fields with the selected user's data
    this.createAndEditForm.patchValue(data);
    // Show the dialog
    this.showDialog = true;
  }

  confirmDelete(data: TrackingUpdate): void {
    // Implement your delete logic here
    // console.log('Delete button clicked for:', data);
  }

  showAddDialog() {
    // Reset the form
    this.createAndEditForm.reset();
    // Clear the selected user
    this.selectedUser = null;
    // Show the dialog
    this.showDialog = true;
    this.router.navigate(['/add-customer'])
  }

  closeAddEmployeeDialog(): void {
    // Reset the form and close the dialog
    this.createAndEditForm.reset();
    this.showDialog = false;
  }

  createForm(): void {
    this.createAndEditForm = this.formBuilder.group({
      name: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: [''],
      postalCode: [''],
      country: ['', Validators.required],
      phone: [''],
      contactName: [''],
      status: [''],
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
  }

  addUser(): void {
    if (this.createAndEditForm.valid) {
      const userData: TrackingUpdate = this.createAndEditForm.value;
      // Perform logic to add user using userData
      // console.log('New user data:', userData);
      // Reset the form after adding the user
      this.createAndEditForm.reset();
      // Close the dialog
      this.showDialog = false;
    } else {
      // Mark all form fields as touched to display validation errors
      this.markFormGroupTouched(this.createAndEditForm);
    }
  }

  editUser(): void {
    if (this.createAndEditForm.valid && this.selectedUser) {
      const updatedUserData: TrackingUpdate = this.createAndEditForm.value;
      // Perform logic to update user using updatedUserData
      // console.log('Updated user data:', updatedUserData);
      // Reset the form after updating the user
      this.createAndEditForm.reset();
      // Clear the selected user
      this.selectedUser = null;
      // Close the dialog
      this.showDialog = false;
    } else {
      // Mark all form fields as touched to display validation errors
      this.markFormGroupTouched(this.createAndEditForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  generateExcelFile() {
    const customerName = this.customerForm.controls.name.value ?? ''
    const customerCountry = this.customerForm.controls.country.value ?? ''
    const customerPostalCode = this.customerForm.controls.postalCode.value ?? ''

    this.apiService.getGenerateExcelApi(environment.endPoints.customerReportsgeneration + '?name=' + customerName + '&country=' + customerCountry + '&postalCode=' + customerPostalCode + '&page=' + this.pageNo + '&size=' + this.pageSize)
      .subscribe((response) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(response);
        downloadLink.download = `excel_file.xlsx`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
  }
  searchCustomers(event) {
    const query = event.query;
    if (query.length >= 3) {
      this.apiService.getApi(environment.endPoints.trackingCustomet + '?customerCode=' + query).subscribe(
        (res) => {
          this.customersList = res.customers;
        },
        (error) => {
          console.error('Error fetching suggestions:', error);
        }
      );
    } else {
      this.customersList = [];
    }
  }
}
