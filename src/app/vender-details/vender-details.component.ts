import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-vender-details',
  templateUrl: './vender-details.component.html',
  styleUrls: ['./vender-details.component.scss']
})
export class VenderDetailsComponent implements OnInit {
  displayPanel: boolean = false; // Variable to control panel visibility
  macroPoint = "http://macropoint/MercerRestApi";
  fourkites = "files@email-integrations.fourkites.com";
  firestone = "Firestone.Carrier.Mercer@jbhunt.onmicrosoft.com";
  tenFourInTransit = "http://hub.10-4.com:443/atlas/frexapi/shipment/position/Mercer";
  tenFourArriveDepart = "http://hub.10-4.com:443/atlas/frexapi/shipment/stopstatus/Mercer"
  locationApi = "http://mercerwebdev.mercer-trans.com/MercerRestApi/rest/<user>/<secret>/vendor/orderlocation";
  vendorDetailsForm: FormGroup;
  vendorList: any = []
  selectedVendor: any;
  showVendorDetails: boolean;
  showVendorLoginDetails: boolean;
  selectedVendorDetails: any = [];
  password: any
  showVendor: boolean = false;
  showLogin: boolean = true;
  authsuccess: any;
  showVendors: boolean = true;

  constructor(private fb: FormBuilder, private apiService: HttpService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.vendorDetailsForm = this.fb.group({
      macroPoint: [],
      fourkites: [],
      firestone: [],
      tenFourInTransit: [],
      tenFourArriveDepart: [],
      locationApi: [],
    });
    // this.initVenderDetails()
    this.getVendorsList()
  }
  getVendorsList() {
    this.apiService.getApi(environment.endPoints.getVendorsList).subscribe((res) => {
      this.vendorList = res;
    })
  }
  getVendorData(vendor: any) {
    this.selectedVendor = vendor;
    this.showVendorLoginDetails = true;
  }
  isEmpty(value: string): boolean {
    return !value.trim();
  }
  initVenderDetails() {
    this.apiService.getApi(environment.endPoints.getVendorDetails).subscribe((res) => {
      this.vendorDetailsForm.patchValue({
        macroPoint: this.returnValue(res, "Macropoint"),
        fourkites: this.returnValue(res, "Fourkite"),
        firestone: this.returnValue(res, "Firestone"),
        tenFourInTransit: this.returnValue(res, "Ten4").split(",")[1],
        tenFourArriveDepart: this.returnValue(res, "Ten4").split(",")[0],
        locationApi: this.returnValue(res, "LocationApi"),
      })
    })
  }
  returnValue(vendorsData, selectedVendor) {
    return vendorsData.filter((vendorData) =>
      vendorData.vendorNames == selectedVendor
    )[0].sendToInfo;
  }
  updateData() {
    this.selectedVendorDetails.forEach((vendor: any) => {
      vendor.fieldValue = vendor.fieldValue.trim();
    });
    const isEmptyField = this.selectedVendorDetails.some((vendor: any) => this.isEmpty(vendor.fieldValue));
    if (isEmptyField) {
      this.messageService.add({ severity: "error", detail: "Please Enter valid " });
    } else
      this.apiService.putApi(environment.endPoints.updateVendorDetails, this.selectedVendorDetails).subscribe((res) => {
        this.showVendorDetails = false;
        this.messageService.add({ severity: res.success ? "success" : "error", detail: res.message })
      })
  }
  showVendorCloaseData() {
    this.showVendors = false;
  }
  submitData() {
    let tokenData = this.apiService.getDecodedTokenPayload()
    const params = {
      loginId: tokenData.loginId,
      password: this.password
    };
    this.apiService.postApi(environment.endPoints.relogin, params).subscribe((response: any) => {
      this.authsuccess = response.success
      if (this.authsuccess === true) {
        this.showVendorLoginDetails = false
        this.showVendorDetails = true
        this.apiService.getApi(environment.endPoints.getVendorDetails + `?vendorId=${this.selectedVendor.vendorId}`).subscribe((res) => {
          this.selectedVendorDetails = res.map((res) => {
            res[res.fieldName] = res.fieldValue;
            return res;
          })
        })
        this.password = ''
      }
      else {
        this.showVendorLoginDetails = true
        this.messageService.add({ severity: "error", summary: "Error", detail: response.message });
      }
    })
  }
  closeVendorData() {
    this.showVendorLoginDetails=false
    this.password=''
  }
}