import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseYearRequest } from 'src/app/shared/models/baseYear/baseYear';


const endpoint = environment.services.baseyear.endpoint;

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class BaseyearService {

  constructor(private http: HttpClient) { }

  getMaxBaseYear(): Observable<any> {
    let url = endpoint.maxbaseyear;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("service getMaxBaseYear success"))
    )
  }


  getAllBaseYear(): Observable<any> {
    let url = endpoint.allBaseyear;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("service getAllBaseYear success"))
    )
  }

  getModeAllBaseYear(): Observable<any> {
    let url = endpoint.ModeAllBaseyear;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("service getModeAllBaseYear success"))
    )
  }

  getActiveBaseYear(): Observable<any> {
    let url = endpoint.activeBaseyear;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("service getAllBaseYear success"))
    )
  }

  createBaseYear(request: BaseYearRequest): Observable<any> {
    let url = endpoint.createBaseYear;
    return this.http.post(url, request, httpOptions).pipe(
      tap(_ => console.log("service createBaseYear success"))
    )
  }



}
