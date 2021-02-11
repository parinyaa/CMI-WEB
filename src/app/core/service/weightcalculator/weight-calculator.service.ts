import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const endpoint = environment.services.baseyear.endpoint.baseyear;

const endpointWeightAction = environment.services.paramInfo.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class WeightCalculatorService {

  constructor(private http: HttpClient) { }
  getBaseYear(): Observable<any>{
    const url = endpoint + '/inquiry';
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log('getBaseYear success'))
    );
  }
  getAction(): Observable<any>{
    const url = endpointWeightAction + '/inquiry' + '/5';
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log('getParamImfo success'))
    );
  }
}
