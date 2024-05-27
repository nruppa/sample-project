import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tracking-details',
  templateUrl: './tracking-details.component.html',
  styleUrls: ['./tracking-details.component.scss']
})
export class TrackingDetailsComponent implements OnInit {
  trackingDetails: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    this.trackingDetails = this.fb.group({
      unit :[],
      eventType : [],
      eventTime : [],
      bolNumber : [],
      trackingNumber : [],
      referenceNumber : [],
      scacCode : [],
      mc : [],
      latitude : [],
      longitude :[],
      cityName : [],
      stateCode : [],
      pickupDate : [],
      order : [],
      driverName : [],
      driverCellPhone : [],
      controllingCustomer : [],
      shippingCustomer : [],
      billToCustomer : [],
      trailer1Number : [],
      trailer1Pct : [],
      trailer2Number : [],
      trailer2Pct : [],
      stopName : [],
      address1 : [],
      address2 : [],
      postalCode : [],
      country : [],
      stopType : []
    });
    this.getTrackingData();
  }
  backNavigation() {
    this.router.navigate(['/tracking'])
  }
  getTrackingData(){
    const trackingDetails = JSON.parse(localStorage.getItem('trackingData'))
    console.log(trackingDetails);
    this.trackingDetails.patchValue({ ...trackingDetails});
  }
}
