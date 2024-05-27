import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppMainComponent } from './app.main.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AuthGuard } from './auth/auth.guard';
import { UsercreationComponent } from './usercreation/usercreation.component';
import { PiechartsComponent } from './piecharts/piecharts.component';
import { TrackingComponent } from './tracking/tracking.component';
import { CustomerComponent } from './customer/customer.component';
import { VenderDetailsComponent } from './vender-details/vender-details.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { CustomerReportsComponent } from './reports/customer-reports/customer-reports.component';
import { VendorReportsComponent } from './reports/vendor-reports/vendor-reports.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { TrackingDetailsComponent } from './tracking-details/tracking-details.component';
import { QueueMonitoringComponent } from './queue-monitoring/queue-monitoring.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { ProfileComponent } from './profile/profile.component';
import { RoleGuard } from './auth/role.guard';

const routes: Routes = [
  {
    path: '', component: AppMainComponent, canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "/piechart", pathMatch: "full" },
      { path: 'user', component: UsercreationComponent ,canActivate: [RoleGuard], data: { allowedRoles: '2' } },
      { path: 'piechart', component: PiechartsComponent },
      { path: 'tracking', component: TrackingComponent },
      { path: 'customer', component: CustomerComponent,canActivate: [RoleGuard], data: { allowedRoles: '2' }  },
      { path: 'vendor', component: VenderDetailsComponent,canActivate: [RoleGuard], data: { allowedRoles: '2' } },
      { path: 'add-customer', component: AddCustomerComponent ,canActivate: [RoleGuard], data: { allowedRoles: '2' } },
      { path: 'edit', component: EditCustomerComponent,canActivate: [RoleGuard], data: { allowedRoles: '2' }  },
      { path: 'customer-reports', component: CustomerReportsComponent },
      { path: 'vendor-reports', component: VendorReportsComponent },
      { path: 'customer-details', component: CustomerDetailsComponent },
      { path: 'tracking-details', component: TrackingDetailsComponent },
      { path: 'queueMonitoring', component: QueueMonitoringComponent, },
      { path: 'profile', component: ProfileComponent },
    ]
  },
  { path: 'error', component: AppErrorComponent },
  { path: 'access', component: AppAccessdeniedComponent },
  { path: 'notfound', component: AppNotfoundComponent },
  { path: 'login', component: AppLoginComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
