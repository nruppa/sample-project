import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { HttpService } from 'src/app/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-reports',
  templateUrl: './customer-reports.component.html',
  styleUrls: ['./customer-reports.component.scss']
})
export class CustomerReportsComponent implements OnInit {
  customerReportForm: FormGroup;
  customerReports: any = [];
  didSearch = false;
  customersList: any = []
  customers = [
    { label: '*DFLT', value: 'Billing delivery default usage only' },
    { label: 'A-1PDA', value: 'A-1 PAPER TUBE SALES' },
    { label: 'AAAB', value: 'ABB AIR' },
    { label: 'AAACOK', value: 'AAA GALVANIZING' },
    { label: 'AAACR', value: 'AAA FIRE PROTECTION' },
    { label: 'AAACSA', value: 'AAA CRANE INC' },
    { label: 'AAAFP', value: 'AAA PACKAGING' },
    { label: 'AAAGJO', value: 'AAA GALVANIZING, INC' },
    { label: 'AAAHS', value: 'ARKANSAS ALUMINUM ALLOYS' },
    { label: 'AAACSA', value: 'AAA CRANE INC' },

  ]
  cols = [
    { header: "Custmer name", width: '12%', field: 'customers' },
    { header: "Sent count", width: '12%', field: 'sentCount' },
    { header: "Not sent count", width: '5%', field: 'notSentCount' },
    { header: 'Total count', width: '9%', field: '' },
  ];
  data: any;
  vendorList: any;
  date = new Date();
  options1: any = {
    delay: 250,
    showLoader: true,
    lazy: true,
  }
  startDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 0, 0)
  endDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 23, 59)
  options = {
    plugins: {
      legend: {
        position: 'bottom' // Change label position inside the Pie chart
      }
    }
  };

  constructor(private fb: FormBuilder, private apiService: HttpService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.customerReportForm = this.fb.group({
      fromAndToDate: [[this.startDate, this.endDate]],
      customerNames: [],
      vendorNames: [],
      documentType: [],
    });
    // this.generateReport();
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
    this.customerReportForm.get('customerNames').reset()
  }

  getVendorName() {
    this.apiService.getApi(environment.endPoints.getVendorsList).subscribe((res) => {
      this.vendorList = res;
    })
  }
  resetSearch() {
    this.customerReportForm.reset();
    this.didSearch = false;
    this.customerReportForm.patchValue({
      fromAndToDate: [this.startDate, this.endDate]
    })
  }
  generateReport() {
    this.didSearch = true;
    let customerData = [];
    let chatColors = [];
    let params = {
      startTime: this.datepipe.transform(this.customerReportForm.value.fromAndToDate[0], "yyyy-MM-dd HH:mm"),
      endTime: this.datepipe.transform(this.customerReportForm.value.fromAndToDate[1], "yyyy-MM-dd HH:mm"),
      customers: this.customerReportForm.controls.customerNames.value === null || this.customerReportForm.controls.customerNames.value === undefined ? '' :
        this.customerReportForm.controls.customerNames.value.toString(),
      vendorCodes: this.customerReportForm.controls.vendorNames.value === null || this.customerReportForm.controls.vendorNames.value === undefined ? '' :
        this.customerReportForm.controls.vendorNames.value.toString()
      //const vendorCode =this.searchForm.value.trackingVendor;
    }
    // if (this.customerReportForm.value.customerNames && this.customerReportForm.value.customerNames.length > 0) {
    //   params.customers = this.customerReportForm.value.customerNames.toString();
    // } else {
    //   params.customers = '';
    // }
    this.apiService.getApi(environment.endPoints.customerPiechartReports, { params: params }).subscribe((res) => {
      res.data.forEach((element) => {
        customerData.push(element.value);
        chatColors.push(this.getRandomColor());
      });

      this.data = {
        labels: res.data,
        datasets: [
          {
            data: res.count,
            backgroundColor: chatColors
          }
        ]
      };
    })
    this.apiService.getApi(environment.endPoints.customerReportsTable, { params: params }).subscribe((res) => {
      this.customerReports = res;
    })
  }
  private formatDate(date: Date): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'MM-dd-yyyy HH:mm:ss');
  }

  generateExcelFile() {
    console.log('hellooo')
    let params = {
      startTime: this.datepipe.transform(this.customerReportForm.value.fromAndToDate[0], "yyyy-MM-dd HH:mm"),
      endTime: this.datepipe.transform(this.customerReportForm.value.fromAndToDate[1], "yyyy-MM-dd HH:mm"),
      customers: this.customerReportForm.controls.customerNames.value === null || this.customerReportForm.controls.customerNames.value === undefined ? '' :
        this.customerReportForm.controls.customerNames.value.toString(),
      vendorCodes: this.customerReportForm.controls.vendorNames.value === null || this.customerReportForm.controls.vendorNames.value === undefined ? '' :
        this.customerReportForm.controls.vendorNames.value.toString()
      // customers: this.customerReportForm.value.customerNames.toString()
    };

    this.apiService.getGenerateExcelApi(environment.endPoints.customerGenerateExcelReports, params)
      .subscribe((response) => {
        const currentDate = new Date();
        const formattedDate = this.formatDate(currentDate);
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(response);
        downloadLink.download = `customer_report_${formattedDate}.xlsx`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
  }


  getRandomColor() {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const color = array[0] & 0xFFFFFF;
    return "#" + ("000000" + color.toString(16)).slice(-6);
  }

}
