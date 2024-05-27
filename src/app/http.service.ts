import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, catchError, map, of } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, private router: Router, private location: Location) { }
  private submitSubject: Subject<any> = new Subject<any>();

  // getUserRole(): Observable<any> {
  //   const role = sessionStorage.getItem('role');
  //   return of(role);
  // }
  getUserRole(): Observable<any> {
    const tokenPayload = this.getDecodedTokenPayload();
    if (tokenPayload && tokenPayload.role) {
      const role = tokenPayload.role;
      sessionStorage.setItem('role', role);
      console.log(sessionStorage.setItem('role', role))
      return of(role);
    }
    return of(null);
  }

  submit$ = this.submitSubject.asObservable();
  // public pipechartLoader = new BehaviorSubject(of(false));

  submit(data: any) {
    this.submitSubject.next(data);
  }
  getDecodedTokenPayload(): any {
    const token = sessionStorage.getItem("token");
    if (token) {
      const tokenPayload = token.split('.')[1];
      return JSON.parse(atob(tokenPayload));
    }
    return null;
  }

  getApi<T>(endpoint: string, options = {}): Observable<any> {
    return this.http.get(endpoint, options).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError<any>())
    );
  }

  getGenerateExcelApi<T>(endpoint: string, params: any = {}): Observable<any> {
    return this.http.get(endpoint, { responseType: 'blob', params }).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError<any>())
    );
  }

  postApi(endpoint, data, options = {}): Observable<any> {
    return this.http.post<any>(endpoint, data, options).pipe(
      map((res) => {
        return res;
      }), catchError(this.handleError<any>())
    );
  }

  putApi(endpoint, data): Observable<any> {
    return this.http.put(endpoint, data).pipe(
      map((res) => {
        return res;
      }), catchError(this.handleError<any>())
    );
  }
  deleteApi(endpoint): Observable<any> {
    return this.http.delete(endpoint).pipe(
      map((uresponse: Response) => {
        return uresponse;
      }), catchError(this.handleError<any>('login')));
  }
  handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      if (error.error.status === '401' && error.error.message === 'Unauthorized') {
        this.router.navigate(['/']);
      }
      return of(result);
    };
  }



  // getApi(endpoint): Observable<any> {
  //   return this.http.get(endpoint).pipe(
  //     map((uresponse: Response) => {
  //       return uresponse;
  //     }), catchError(this.handleError<any>('login')));
  // }
  // deleteApi(endpoint): Observable<any> {
  //   return this.http.delete(endpoint).pipe(
  //     map((uresponse: Response) => {
  //       return uresponse;
  //     }), catchError(this.handleError<any>('login')));
  // }
  // postApi(endpoint, data): Observable<any> {
  //   return this.http.post<any>(endpoint, data).pipe(
  //     map((uresponse: Response) => {
  //       return uresponse;
  //     }), catchError(this.handleError<any>('login'))
  //   );
  // }
  // putApi(endpoint, data): Observable<any> {
  //   return this.http.put(endpoint, data).pipe(
  //     map((uresponse: Response) => {
  //       return uresponse;
  //     }), catchError(this.handleError<any>('login'))
  //   );
  // }
  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     if (error.status === 401 ) {
  //       console.log();

  //       this.router.navigate(['/']);
  //     }
  //     return of(result as T);
  //   };
  // }



  // //To extract details from JWT
  // getUserData() {
  //   let data = localStorage.getItem("token")!=null?this.decrypt(localStorage.getItem("token"))?.replace('Bearer ', ''):null;
  //   let defaultData = {
  //     fileVisibility: 'false',
  //     isAllPartnersVisible: 'false',
  //     isAllSfgPartnersVisible: 'false'
  //   }
  //   //Setting default values if there is no JWT
  //   if (data == null || data == "" || data.split('.').length == 0) {
  //     return defaultData;
  //   } else {
  //     return { ...defaultData, ...JSON.parse(atob(data.split('.')[1])) }
  //   }
  // }
  // //For encryption
  // encrypt(data){
  //   return CryptoJS.AES.encrypt(data,environment.encodingKey).toString();
  // }
  // //For decryption
  // decrypt(data){
  //   return CryptoJS.AES.decrypt(data??"",environment.encodingKey).toString(CryptoJS.enc.Utf8);
  // }
  // //For back navigation to home page
  // backNavigate(){
  //   if (this.getUserData()?.roleId=="1") {
  //     this.router.navigate(['profile']);
  //   } else {
  //     this.router.navigate(['doc-repo'])
  //   }
  // }
}

