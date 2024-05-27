// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { endPoints } from "./endPoints";



const baseUrl = 'http://172.17.10.103:7071/mercer/apitracking';

export const environment = {
  production: false,
  endPoints: {
    login: baseUrl + endPoints.login,
    transactionHourData: baseUrl + endPoints.transactionHourData,
    vendorDailyReports: baseUrl + endPoints.vendorDailyReports,
    getUser: baseUrl + endPoints.getUser,
    addUser: baseUrl + endPoints.addUser,
    deleteUser: baseUrl + endPoints.deleteUser,
    updateUser: baseUrl + endPoints.updateUser,
    getUsers: baseUrl + endPoints.getUsers,
    trackingCustomet:baseUrl + endPoints.trackingCustomet,
    trackingSearch: baseUrl + endPoints.trackingSearch,
    customerPiechartReports: baseUrl + endPoints.customerPiechartReports,
    customerGenerateExcelReports: baseUrl + endPoints.customerGenerateExcelReports,
    vendorGenerateExcelReports: baseUrl + endPoints.vendorGenerateExcelReports,
    vendorPiechartReports: baseUrl + endPoints.vendorPiechartReports,
    customerReportsTable: baseUrl + endPoints.customerReportsTable,
    vendorReportsTable: baseUrl + endPoints.vendorReportsTable,
    trackingReportsgeneration: baseUrl + endPoints.trackingReportsgeneration,
    getCustomers: baseUrl + endPoints.getCustomers,
    customerReportsgeneration: baseUrl + endPoints.customerReportsgeneration,
    addCustomers: baseUrl + endPoints.addCustomers,
    addSubscriptionDetails: baseUrl + endPoints.addSubscriptionDetails,
    getSubscriptionDetails: baseUrl + endPoints.getSubscriptionDetails,
    updateSubscriptionDetails: baseUrl + endPoints.updateSubscriptionDetails,
    updateCustomer: baseUrl + endPoints.updateCustomer,
    customerCodeExists: baseUrl + endPoints.customerCodeExists,
    getTrackingExcel: '',
    getVendorsList:baseUrl + endPoints.getVendorsList,
    getVendorDetails:baseUrl + endPoints.getVendorDetails,
    updateVendorDetails:baseUrl + endPoints.updateVendorDetails,
    resetPassword:baseUrl + endPoints.resetPassword,
    relogin:baseUrl + endPoints.relogin,
    Addqueue:baseUrl + endPoints.Addqueue,
    checkConnection:baseUrl + endPoints.checkConnection,
    queueTableData:baseUrl + endPoints.queueTableData,
    queueupdate:baseUrl + endPoints.queueupdate,
    deletedqueue:baseUrl + endPoints.deletedqueue,
    checkEmailIdExists:baseUrl + endPoints.checkEmailIdExists,
    forgotpassword:baseUrl + endPoints.forgotpassword
  }
}




/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
