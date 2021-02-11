import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';


const endpoint = environment.services.baseyear.endpoint.baseyear;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'

  }),
};
@Injectable({
  providedIn: 'root'
})
export class BaseyearCpipService {

  constructor(
    private http: HttpClient
  ) { }
  inquiryBaseYear(): Observable<any> {
    const url = `${endpoint}/inquiry`;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log('service inquiryBaseYear success'))
    );
  }
}
