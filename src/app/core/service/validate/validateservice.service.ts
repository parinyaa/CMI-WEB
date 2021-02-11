import { Observable } from 'rxjs';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const endpont = environment.services.validate.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class ValidateserviceService {

  constructor(
    private http:HttpClient
  ) { }

  getCount(type:number):Observable<any>{
    let url = endpont+"/getcount/"+type;
    return this.http.get(url,httpOptions).pipe(
      tap( _=> console.log("getCount success"))
    );
  }





}
