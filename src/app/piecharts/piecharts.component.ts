import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-piecharts',
  templateUrl: './piecharts.component.html',
  styleUrls: ['./piecharts.component.scss']
})
export class PiechartsComponent implements OnInit {
  vendors = [
    { label: 'FK', value: 'FourKite/Firestone' },
    { label: 'FT', value: 'TenFour' },
    { label: 'AP', value: 'Mercer API(Project 44)' },
    { label: 'MP', value: 'Macropoint' }
  ]

  options: any;
  optionsLabel: any;
  ngOnInit(): void {
    this.getTransPerHour();
    this.getVendorReportData();
  }
  // Customer vs Tracking updates - Pie Chart data and options
  vendorVsTrackingData: any;

  // Daily failure rate - Pie Chart data and options
  dailyFailureRateData: any;
  dailyFailureRateOptions: any;

  // Updates per hour - Line Chart data and options
  updatesPerHourData: any;
  updatesPerHourOptions: any;

  constructor( private apiService: HttpService, ) { 
   
    
    this.optionsLabel = {
      plugins: {
        legend: {
          position: 'bottom' // Change label position inside the Pie chart
        }
      }
    };
    
    
    this.options = {
      plugins: {
        legend: {
          position: 'bottom' // Change label position inside the Pie chart
        }
      }
    };
    this.updatesPerHourOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }
  getRandomColor() {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const color = array[0] & 0xFFFFFF;
    return "#" + ("000000" + color.toString(16)).slice(-6);
  }

  
  getTransPerHour() {
    this.apiService.getApi(environment.endPoints.transactionHourData).subscribe( res => {
      this.updatesPerHourData = {
      labels: res.data,
      datasets: [
        {
          label: 'Updates per Hour',
          data: res.count,
          fill: false,
          borderColor: '#4bc0c0'
        }
      ]
    };
    },
      (error) => {
        console.error('Error occurred while fetching data:', error);
        // Handle errors
      }
    )
  }
  getVendorReportData(){
    let customerData = [];
    let chatColors =[];
    this.apiService.getApi(environment.endPoints.vendorDailyReports).subscribe( res => {      
    res.data.forEach((element) => {
      customerData.push(element.value);
      chatColors.push(this.getRandomColor());
    });
    this.vendorVsTrackingData = {
      labels:res.data,
      datasets: [
        {
          data: res.count,
          backgroundColor: chatColors
        }
      ]
    };
  })
  }
}
