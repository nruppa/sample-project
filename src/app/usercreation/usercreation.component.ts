import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usercreation',
  templateUrl: './usercreation.component.html',
  styleUrls: ['./usercreation.component.scss']
})
export class UsercreationComponent implements OnInit {
  filteredData: any[] = [];
  totalRecords: number = 0;
  showDialog: boolean = false;
  createForm: FormGroup;
  submitted: boolean = false;
  showEditDialog: boolean = false;
  editForm: FormGroup;
  deleteItemData: any; // Data of the item to be deleted
  showDeleteConfirmation: boolean = false; // Flag to control delete confirmation dialog
  isSearchTriggered: boolean = false; // Flag to control when to trigger the search
  // Define filter properties
  firstNameFilter: string = '';
  lastNameFilter: string = '';
  emailFilter: string = '';
  roleFilter: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  roles: any[] = [
    { label: 'Admin', value: "1" },
    { label: 'User', value: "2" }
  ];

  cols = [
    { header: "First Name", width: '12%', field: 'firstName' },
    { header: "Last Name", width: '12%', field: 'lastName' },
    { header: "Email ID", width: '5%', field: 'emailId' },
    { header: 'Phone Number', width: '9%', field: 'phoneNumber' },
    { header: 'Role', width: '9%', field: 'getRoleById(data.role)' },
    { header: 'Actions', width: '9%', field: '' },
  ];
  userData: any;
  userId: any;
  first: any;
  pageCount: number;
  searchForm: FormGroup
  getEndPoint: string;
  activeState: boolean[] = [true, true];
  searchFields: boolean = false
  searchFields1: boolean = false
  addFields: boolean;
  isFormDirty: boolean
  index: number;
  didSearch = false;
  constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService,
    private apiService: HttpService, private messageService: MessageService) { }
  openDialog(): void {
    this.showDialog = true;
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      firstname: [''],
      lastname: [''],
      role: []
    })
    // Initialize the form group
    this.createForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern('[A-Za-z]*')]],
      lastname: ['', [Validators.required, Validators.pattern('[A-Za-z]*')]],
      emailid: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$")]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      role: [null, Validators.required]
    });

    // Initialize the edit form group
    this.editForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[A-Za-z]*')]],
      lastName: ['', [Validators.required, Validators.pattern('[A-Za-z]*')]],
      emailId: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$")]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      role: ['', Validators.required]
    });
  }
  handleChange(e) {
    var index = e.index;
    if (index == 0) {
      this.resetSearch()
    } else if (index == 1) {
      this.createForm.reset()
      this.resetSearch()
    }
  }
  getUserData() {
    this.didSearch = true;
    const firstName = this.searchForm.controls.firstname.value ?? ''
    const lastName = this.searchForm.controls.lastname.value ?? ''
    const role = this.searchForm.controls.role.value ?? ''
    this.apiService.getApi(environment.endPoints.getUser + '?firstName=' + firstName + '&lastName=' + lastName + '&role=' + role + '&page=' + this.pageNo + ' &size=' + this.pageSize).subscribe((res) => {
      this.userData = res.users
      this.pageCount = res.totalCount
    })
  }

  paginate(event) {
    const { page, rows } = event;
    if (![page, rows].every((param, index) => param === [this.pageNo, this.pageSize][index])) {
      this.pageNo = page;
      this.pageSize = rows;
      this.getUserData();
    }
  }

  resetSearch() {
    this.searchForm.reset();
    this.didSearch = false;
  }
  addUser() {
    if (this.createForm.invalid) {
      Object.keys(this.createForm.controls).forEach(formControlName => {
        this.createForm.get(formControlName).markAsTouched();
      });
    } else {
      const data = {
        "firstName": this.createForm.controls.firstname.value,
        "lastName": this.createForm.controls.lastname.value,
        "emailId": this.createForm.controls.emailid.value,
        "phoneNumber": this.createForm.controls.phoneNumber.value,
        "role": this.createForm.controls.role.value
      }
      this.apiService.postApi(environment.endPoints.addUser, data).subscribe((res) => {
        if (res.success == true) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.message })
          this.createForm.reset();
          this.getUserData()
        }
        else {
          this.messageService.add({ severity: "error", summary: "error", detail: res.message });
          this.showDialog = false
        }
      })
    }
  }

  openEditEmployeeDialog(data: any) {
    this.isFormDirty = false
    this.showEditDialog = true;
    this.userId = data.id
    this.editForm.patchValue({ ...data });
    this.getUserData()
  }

  openEditEmployeeDialog1(data: any) {
    this.showEditDialog = true;
    this.userId = data.id;
    // const selectedRole = this.roles.find(role => role.label === data.role);
    this.editForm.patchValue(data);
  }

  getRoleById(id) {
    return this.roles.find(res => res.value == id)?.label
  }

  updateUser() {
    if (this.editForm.invalid) {
      Object.keys(this.editForm.controls).forEach(formControlName => {
        this.editForm.get(formControlName).markAsTouched();
      });
    } else {
      const data = {
        "firstName": this.editForm.controls.firstName.value,
        "lastName": this.editForm.controls.lastName.value,
        "emailId": this.editForm.controls.emailId.value,
        "phoneNumber": this.editForm.controls.phoneNumber.value,
        "role": this.editForm.controls.role.value
      }
      this.apiService.putApi(environment.endPoints.updateUser + this.userId, data).subscribe((res) => {
        if (res) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.message });
          this.showEditDialog = false;
          this.getUserData()
        }
      })
    }
  }

  openAddEmployeeDialog() {
    this.showDialog = true;
  }

  closeAddEmployeeDialog() {
    this.showDialog = false;
    this.submitted = false;
    this.createForm.reset();
  }

  closeEditEmployeeDialog() {
    // Close dialog for editing an employee
    this.showEditDialog = false;
    this.submitted = false;
    this.editForm.reset();
  }

  onEditSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }
    // Submit logic here
    this.closeEditEmployeeDialog();
  }

  confirmDelete(data: any, event: Event) {
    event.preventDefault();
    this.deleteItemData = data;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      accept: () => {
        this.apiService.deleteApi(environment.endPoints.deleteUser + data.id).subscribe(res => {
          if (res) {
            this.messageService.add({ severity: "success", summary: "Success", detail: res.message });
            this.getUserData()
          }
        })
      }
    });
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
  }

  deleteItem() {
    // console.log('Deleted item:', this.deleteItemData);
    // Perform delete operation here using the deleteItemData
    // After successful deletion, reset the deleteItemData and hide the confirmation dialog
    // Example:
    // deleteOperation(this.deleteItemData).subscribe(() => {
    //   this.deleteItemData = null;
    // });
    this.deleteItemData = null; // Reset deleteItemData
  }


  // Inside UsercreationComponent class

  filterFirstName() {
    this.filteredData = this.filteredData.filter((item: any) => {
      return item.firstname.toLowerCase().includes(this.firstNameFilter.toLowerCase());
    });
  }

  filterLastName() {
    this.filteredData = this.filteredData.filter((item: any) => {
      return item.lastname.toLowerCase().includes(this.lastNameFilter.toLowerCase());
    });
  }

  filterEmail() {
    this.filteredData = this.filteredData.filter((item: any) => {
      return item.emailid.toLowerCase().includes(this.emailFilter.toLowerCase());
    });
  }

  filterRole() {
    if (this.roleFilter) {
      this.filteredData = this.filteredData.filter((item: any) => {
        return item.role.toLowerCase().includes(this.roleFilter.toLowerCase());
      });
    } else {
      this.filteredData = [...this.filteredData];
    }
  }
  checkEmailIdExists(event: any) {
    const emailId = event.target.value;
    console.log(emailId, 'emailid')
    this.apiService.getApi(environment.endPoints.checkEmailIdExists + '?emailId=' + emailId).subscribe({
      next: (res: any) => {
        if (res.success === true) {
          this.createForm.get('emailid')?.setErrors({ 'incorrect': true });
        }
      }
    }
    );
  }
}
