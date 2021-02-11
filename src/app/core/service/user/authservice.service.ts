import { AuthRequest } from './../../../shared/models/request/auth-request';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenResponse } from './model/authenResponese';
import { refreshToken } from './model/refreshToken';

const endpoint = environment.services.authen.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json;charset=UTF-8'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  public currentUserSubject: BehaviorSubject<AuthenResponse>;
  public currentUser: Observable<AuthenResponse>;

  constructor(
    private http:HttpClient
  ) { 
    this.currentUserSubject = new BehaviorSubject<AuthenResponse>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  signIn(body:AuthRequest):Observable<any>{
    let url = endpoint.activeUesr;
    return this.http.post<any>(url,body,httpOptions).pipe(
      map(res => {
        if (res && res.accessToken) {
          sessionStorage.setItem('currentUser', JSON.stringify(res));
            this.currentUserSubject.next(res);
        return res;
        }})
    )
  }

  refreshTokenAuth(body:refreshToken):Observable<any> {
    let url = endpoint.refreshToken;
    return this.http.post<any>(url,body).pipe(
      map(res => {
        if (res) {
          sessionStorage.setItem('currentUser', JSON.stringify(res));
          this.currentUserSubject.next(res);
          console.log("refreshTokenAuth"+res);
          return res;
        }
       })
    )
  }

  getCurrentUser():Observable<any>{
    var url = endpoint.getCurrentUser;
    return this.http.get(url).pipe(
      map(res => {
        sessionStorage.setItem('userProfile', JSON.stringify(res));
        sessionStorage.setItem('imputation', JSON.stringify(res['objects']));
        return res;
      })
    )
  }

  currentUserValue(): AuthenResponse {
    return this.currentUserSubject.value;
  }

  logout(){
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
}

  


}
