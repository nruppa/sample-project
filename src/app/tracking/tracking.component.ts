import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  // providers: [MessageService]

})
export class TrackingComponent implements OnInit {

  trackingUpdates: any[] = [];
  filteredTrackingUpdates: any[] = [];
  startDate: Date | undefined;
  endDate: Date | undefined;
  // selectedCustomer: string | undefined;
  selectedStatus: string | undefined;
  selectedTrans: string | undefined;
  // startAndEndDate:any
  database: any = "LIVE"
  customers: any[] = [
    { name: 'john' },
    { name: 'kartik' }
  ];
  vendors = [
    { label: 'FK', value: 'FourKite/Firestone' },
    { label: 'FT', value: 'TenFour' },
    { label: 'AP', value: 'Mercer API(Project 44)' },
    { label: 'MP', value: 'Macropoint' }
  ]
  statusOptions = [
    { name: 'Pending' },
    { name: 'Completed' },
    { name: 'Dispatched' }
  ]

  cols = [
    { field: 'unit', header: 'Unit' },
    { field: 'eventType', header: 'Event Type' },
    { field: 'eventTime', header: 'Event Time' },
    { field: 'bOLNumber', header: 'BOL Number' },
    { field: 'trackingNumber', header: 'Tracking Number' },
    { field: "referenceNumber", header: "Reference Number" },
    { field: "action", header: "Action" },
  ];

  customersData = [
    { label: '*DFLT', value: 'Billing delivery default usage only' },
    { label: 'A-1PDA', value: 'A-1 PAPER TUBE SALES' },
    { label: 'AAAB', value: 'ABB AIR' },
    { label: 'AAACOK', value: 'AAA GALVANIZING' },
    { label: 'AAACR', value: 'AAA FIRE PROTECTION' },
    { label: 'AAACSA', value: 'AAA CRANE INC' },
    { label: 'AAAFP', value: 'AAA PACKAGING' },
    { label: 'AAAGJO', value: 'AAA GALVANIZING, INC' },
    { label: 'AAAHS', value: 'ARKANSAS ALUMINUM ALLOYS' }
  ]
  showGrid: boolean = false;
  rowData: any;
  items: { label: string; icon: string; command: () => void; }[];
  searchForm: FormGroup
  pageNo: number = 0;
  pageSize: number = 10;
  getcust: any[] = [];
  trackingData: any = [];
  pageCount: any;
  isFetchingData = false;
  visibleCustomers: any[] = [];
  searchEndpoint: any;
  didSearch: boolean = false
  customersList: any[] = [];
  @Input() options: any[] = [];
  @Output() optionSelected = new EventEmitter<any>();

  currentPage = 1;
  // pageSize = 10;
  loading = false;
  vendorList: any;
  options1: any = {
    delay: 250,
    showLoader: true,
    lazy: true,
  }
  constructor(private messageService: MessageService, private router: Router, private formBuilder: FormBuilder,
    private apiService: HttpService, private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      trackingRange: [''],
      trackingVendor: [''],
      trackingCustomer: ['']
    });
    this.getVendorName()
    const query = '';
    const vendorCode = '';
    this.apiService.getApi(environment.endPoints.trackingCustomet + '?customerCode=' + query + '&vendorCodes=' + vendorCode).subscribe(
      (res) => {
        this.customersList = res.customers;
      },
      (error) => {
        console.error('Error fetching suggestions:', error);
      }
    );
  }
  getVendorName() {
    this.apiService.getApi(environment.endPoints.getVendorsList).subscribe((res) => {
      this.vendorList = res;
    })
  }

  getTracking() {
    this.didSearch = true;
    const form = this.searchForm.controls;
    const startDate = form.trackingRange.value ? this.datepipe.transform(form.trackingRange.value[0], "yyyy-MM-dd HH:mm:ss") : '';
    const endDate = form.trackingRange.value ? this.datepipe.transform(form.trackingRange.value[1], "yyyy-MM-dd HH:mm:ss") : '';
    const customerCodes = this.searchForm.controls.trackingCustomer.value === null || this.searchForm.controls.trackingCustomer.value === undefined ? '' :
      this.searchForm.controls.trackingCustomer.value.toString()
    const vendorCodes = this.searchForm.controls.trackingVendor.value === null || this.searchForm.controls.trackingVendor.value === undefined ? '' :
      this.searchForm.controls.trackingVendor.value.toString()
    //const vendorCode =this.searchForm.value.trackingVendor;
    // if (startDate && endDate) {
    //   this.searchEndpoint = '?startDate=' + startDate + ' &endDate=' + endDate + '&page=' + this.pageNo + '&size=' + this.pageSize
    // } else if (customerCodes && startDate == '' && endDate == '') {
    //   this.searchEndpoint = '?customerCode=' + customerCodes + '&page=' + this.pageNo + '&size=' + this.pageSize
    // } else {
    //   this.searchEndpoint = '?page=' + this.pageNo + '&size=' + this.pageSize
    // }
    this.searchEndpoint = '?startDate=' + startDate + ' &endDate=' + endDate + '&customerCodes=' + customerCodes + '&vendorCodes=' + vendorCodes + '&page=' + this.pageNo + '&size=' + this.pageSize
    this.apiService.getApi(environment.endPoints.trackingSearch + this.searchEndpoint).subscribe(res => {
      this.trackingData = res.trackingDetails
      this.pageCount = res.totalCount
    },)
  }
  paginate(event) {
    const { page, rows } = event;
    if (![page, rows].every((param, index) => param === [this.pageNo, this.pageSize][index])) {
      this.pageNo = page;
      this.pageSize = rows;
      this.getTracking();
    }
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.didSearch = false;
  }

  viewTrackingData(data) {
    this.router.navigate(['/tracking-details'])
    localStorage.setItem('trackingData', JSON.stringify(data))
  }
  // private formatDate(date: Date): string {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const hours = String(date.getHours()).padStart(2, '0');
  //   const minutes = String(date.getMinutes()).padStart(2, '0');
  //   const seconds = String(date.getSeconds()).padStart(2, '0');
  //   return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
  // }
  private formatDate(date: Date): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'MM-dd-yyyy HH:mm:ss');
  }
  generateExcelFile() {
    const form = this.searchForm.controls;
    const startDate = form.trackingRange.value ? this.datepipe.transform(form.trackingRange.value[0], "yyyy-MM-dd HH:mm:ss") : '';
    const endDate = form.trackingRange.value ? this.datepipe.transform(form.trackingRange.value[1], "yyyy-MM-dd HH:mm:ss") : '';
    const customerCodes = this.searchForm.controls.trackingCustomer.value === null || this.searchForm.controls.trackingCustomer.value === undefined ? '' :
      this.searchForm.controls.trackingCustomer.value.toString()
    const vendorCodes = this.searchForm.controls.trackingVendor.value === null || this.searchForm.controls.trackingVendor.value === undefined ? '' :
      this.searchForm.controls.trackingVendor.value.toString()
    //const vendorCode =this.searchForm.value.trackingVendor;
    // if (startDate && endDate) {
    //   this.searchEndpoint = '?startDate=' + startDate + ' &endDate=' + endDate + '&page=' + this.pageNo + '&size=' + this.pageSize
    // } else if (customerCode && startDate == '' && endDate == '') {
    //   this.searchEndpoint = '?customerCode=' + customerCode + '&page=' + this.pageNo + '&size=' + this.pageSize
    // } else {
    //   this.searchEndpoint = '?page=' + this.pageNo + '&size=' + this.pageSize
    // }
    this.searchEndpoint = '?startDate=' + startDate + '&endDate=' + endDate + '&customerCodes=' + customerCodes + '&vendorCodes=' + vendorCodes + '&page=' + this.pageNo + '&size=' + this.pageSize
    this.apiService.getGenerateExcelApi(environment.endPoints.trackingReportsgeneration + this.searchEndpoint)
      .subscribe((response) => {
        const currentDate = new Date();
        const formattedDate = this.formatDate(currentDate);
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(response);
        downloadLink.download = `tracking_report_${formattedDate}.xlsx`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
  }
  onVendorChange(selectedVendor: any): void {
    console.log(selectedVendor, 'sele')
    const customerCode = ''
    if (selectedVendor) {
      const vendorCode = selectedVendor;
      this.apiService.getApi(environment.endPoints.trackingCustomet + '?customerCode=' + customerCode + '&vendorCodes=' + vendorCode).subscribe(
        (res) => {
          this.customersList = res.customers;
        },
        (error) => {
          console.error('Error fetching suggestions:', error);
        }
      );
    }
    this.customersList = []
    this.searchForm?.get('trackingCustomer').reset()
  }

}
