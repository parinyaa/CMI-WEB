import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InsertCurrencyRequest } from 'src/app/shared/models/currency/request/InsertCurrencyRequest.model';

const endpoint = environment.services.currency.endpoint;
let httpOptions = {};

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(
    private http: HttpClient
  ) {
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8'
      })
    }
  }

  getCurrencyByYearAndMonth(year: number, month: number): Observable<any> {
    let url = endpoint.data + '/year/' + year + '/month/' + month;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getCurrencyByYearAndMonth Success"))
    )
  }

  insertCurrency(body: InsertCurrencyRequest): Observable<any> {
    let url = endpoint.insert
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("insertCurrency Success"))
    )
  }

}
