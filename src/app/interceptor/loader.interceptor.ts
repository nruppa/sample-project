import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoaderService } from '../service/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(public router: Router, public apisService: HttpService, public loaderService: LoaderService, public messageService: MessageService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loaderService.show();
    //Passing token for authorization
    let token = sessionStorage.getItem("token")
    if (token != null) {
      request = request.clone({
        setHeaders: {
          //Passing decrypted token
          Authorization:token,
        },
      });
    }
    //To add required headers(partner visibility)
    // request = request.clone({ headers: request.headers.append('isAll', this.apisService.getUserData().isAllPartnersVisible) });
    // request = request.clone({ headers: request.headers.append('isAllSfg', this.apisService.getUserData().isAllSfgPartnersVisible) });
    //If the user is un authenticated
    return next.handle(request).pipe(
      finalize(() => { this.loaderService.hide(); }),
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigateByUrl("login");
        }
        else if (err.status === 404) {
          this.messageService.add({
            severity: "error",
            summary: "Internal server error",
            detail: "Requested resource not found.",
          });
        }
        else if (err.status.toString().startsWith("5")) {
          this.messageService.add({
            severity: "error",
            summary: "Internal server error",
            detail: "Something went wrong, please contact admin.",
          });
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      }))
  }
}
