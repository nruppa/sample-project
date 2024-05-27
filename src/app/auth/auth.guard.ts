import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private authService: HttpService, private router: Router) {}

canActivate(): boolean {
  const token = sessionStorage.getItem('token');
  if (token) {
    return true;
  } else {
    this.router.navigate(['/login']);
    return false;
  }
}
}
