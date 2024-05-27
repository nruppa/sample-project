import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { log } from 'console';
import { MessageService, SortEvent } from 'primeng/api';
import { HttpService } from 'src/app/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendor-reports',
  templateUrl: './vendor-reports.component.html',
  styleUrls: ['./vendor-reports.component.scss']
})
export class VendorReportsComponent implements OnInit {
  vendorReportForm: FormGroup;
  date = new Date();
  vendorReports: any = []
  options: any;
  didSearch = false;
  startDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 0, 0)
  endDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 23, 59)
  vendors = [
    { label: 'FK', value: 'FourKite/Firestone' },
    { label: 'FT', value: 'TenFour' },
    { label: 'AP', value: 'Mercer API(Project 44)' },
    { label: 'MP', value: 'Macropoint' }
  ]

  status = [
    { label: 'PE', value: 'Pending' },
    { label: 'CM', value: 'Completed' },
    { label: 'DI', value: 'Dispatched' }
  ]
  cols = [
    { header: "Vendor name", width: '12%',field:'subscription_type'},
    { header: "Sent count", width: '12%',field :'sentCount'},
    { header: "Not sent count", width: '5%', field:'notSentCount'},
    { header: 'Total count', width: '9%', field:''},
  ];
  data: { labels: any[]; datasets: { data: number[]; backgroundColor: any[]; }[]; };
  vendorList: any;
  constructor(private fb: FormBuilder, private apiService: HttpService, public datepipe: DatePipe, private messageService: MessageService) { }

  ngOnInit(): void {
    this.vendorReportForm = this.fb.group({
      fromAndToDate: [[this.startDate, this.endDate]],
      vendorNames: [[]],
      // documentType: []
    });
    this.getVendorName()
  }
  resetSearch() {
    this.vendorReportForm.reset();
    this.didSearch = false;
    this.vendorReportForm.patchValue({
      fromAndToDate: [this.startDate, this.endDate]
    })
  }
  getVendorName() {
    // return this.vendors.filter((data)=>data.label==vendorKey)[0].value
    this.apiService.getApi(environment.endPoints.getVendorsList).subscribe((res) => {
      this.vendorList = res;
    })
  }
  generateReport() {
    this.didSearch = true;
    let vendorData = [];
    let chatColors = [];
    let params = {
      startTime: this.datepipe.transform(this.vendorReportForm.value.fromAndToDate[0], "yyyy-MM-dd HH:mm"),
      endTime: this.datepipe.transform(this.vendorReportForm.value.fromAndToDate[1], "yyyy-MM-dd HH:mm"),
      vendors: this.vendorReportForm.value.vendorNames.toString()
    }
    this.apiService.getApi(environment.endPoints.vendorPiechartReports, { params: params }).subscribe((res) => {
      res.data.forEach((element) => {
        vendorData.push(element.value);
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
    this.options = {
      plugins: {
        legend: {
          position: 'bottom' // Change label position inside the Pie chart
        }
      }
    };
    this.apiService.getApi(environment.endPoints.vendorReportsTable, { params: params }).subscribe((res) => {
      this.vendorReports = res;
      console.log(this.vendorReports,'vendorReports')
    })
  }

  getRandomColor() {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const color = array[0] & 0xFFFFFF;
    return "#" + ("000000" + color.toString(16)).slice(-6);
  }
  private formatDate(date: Date): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date,'MM-dd-yyyy HH:mm:ss');
  }
  generateExcelFile() { 
    let params = {
      startTime: this.datepipe.transform(this.vendorReportForm.value.fromAndToDate[0], "yyyy-MM-dd HH:mm"),
      endTime: this.datepipe.transform(this.vendorReportForm.value.fromAndToDate[1], "yyyy-MM-dd HH:mm"),
      vendors: this.vendorReportForm.value.vendorNames.toString()
    }
    this.apiService.getGenerateExcelApi(environment.endPoints.vendorGenerateExcelReports, params).subscribe((res) => {
      const currentDate = new Date();
      const formattedDate = this.formatDate(currentDate);
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(res);
      downloadLink.download = `vendor_report_${formattedDate}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
  // generateExcelFile() { 
  //   let params = {
  //     startTime: this.datepipe.transform(this.vendorReportForm.value.fromAndToDate[0], "yyyy-MM-dd HH:mm"),
  //     endTime: this.datepipe.transform(this.vendorReportForm.value.fromAndToDate[1], "yyyy-MM-dd HH:mm"),
  //     vendors: this.vendorReportForm.value.vendorNames.toString()
  //   }
  //   this.apiService.getGenerateExcelApi(environment.endPoints.vendorGenerateExcelReports, params).subscribe((res) => {
  //     const currentDate = new Date();
  //     const formattedDate =  new Date().toISOString().replace(/:/g, '-');
  //     const downloadLink = document.createElement('a');
  //     downloadLink.href = URL.createObjectURL(res);
  //     downloadLink.download = `vendor_report_${formattedDate}.xlsx`;
  //     document.body.appendChild(downloadLink);
  //     downloadLink.click();
  //     document.body.removeChild(downloadLink);
  //   });
  // }
}

