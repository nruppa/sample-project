import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';

@Component({
    selector: 'app-menu',
    template: `
    <ul class="layout-menu">
        <li app-menuitem *ngFor="let item of model; let i = index;"
            [item]="item" [index]="i" [visible]="true" [root]="true"></li>
    </ul>
 
    `
})
export class AppMenuComponent implements OnInit {
    model: any[];
    userRole: string;
    ngOnInit() {
        const role = sessionStorage.getItem('role');

        this.model = [
            {
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: ['/profile'] },
                    { label: 'Users', icon: 'pi pi-fw pi-user-plus', routerLink: ['/user'], visible: role === '2' },
                    { label: 'Daily Statistics', icon: 'pi pi-fw pi-check-square', routerLink: ['/piechart'] },
                    {
                        label: "Reports",
                        icon: 'pi pi-file',
                        items: [
                            { label: "Customer Reports", icon: "pi pi-book", routerLink: ["/customer-reports"] },
                            { label: "Vendor Reports", icon: "pi pi-book", routerLink: ["/vendor-reports"] }
                        ]
                    },
                    { label: 'Vendors', icon: 'pi pi-fw pi-building', routerLink: ['/vendor'] ,visible: role === '2'},
                    { label: 'Customers', icon: 'pi pi-fw pi-users', routerLink: ['/customer'], visible: role === '2' },
                    { label: 'Tracking', icon: 'pi pi-fw pi-map-marker', routerLink: ['/tracking'] },
                    { label: 'Queue Monitoring', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/queueMonitoring'] }
                ]
            }
        ];
  }
    constructor(private httpService: HttpService) { }
}



