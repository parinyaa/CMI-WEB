import { PriceDataRequestForm } from './../../../shared/models/dataenty/request/PriceDataRequestForm';
import { environment } from 'src/environments/environment';
import { WorkFlowEntyRequest } from './../../../shared/models/dataenty/request/WorkFlowRequest';
import {GetDataSetRequest} from '../../../shared/models/dataenty/request/GetDataSetRequest';
import {GetMatrixRequest} from '../../../shared/models/dataenty/request/GetMatrixRequest';
import {MonthlyDataSaveRequest} from '../../../shared/models/dataenty/request/MonthlyDataSaveRequest';
import {Observable} from 'rxjs';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';

const endpoint = environment.services.dataEnty.endpoint.monthly;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class DataEntyService {
  showRoute = false;
  constructor(
    private http: HttpClient
  ) {
  }

  setShowRoute(showRoute: boolean) {
    this.showRoute = showRoute;
  }
  getShowRoute() {
    return this.showRoute;
  }

  getCurrentMonth(): Observable<any> {
    const url = endpoint.getCurrentMonth;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log('getCurrentMonth success'))
    );
  }

  onSaveMonthlyData(body: MonthlyDataSaveRequest): Observable<any> {
    const url = endpoint.getCurrentMonth + '/savemonthly';
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log('onSaveMonthlyData success'))
    );
  }

  getMatrix(body: GetMatrixRequest) {
    const url = endpoint.getCurrentMonth + '/getMatrix';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log('getMatrix success'))
    );
  }

  getDataSet(body: GetDataSetRequest): Observable<any> {
    const url = endpoint.getCurrentMonth + '/dataset';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log('getDataSet success'))
    );
  }

  getWorkFlow(body:WorkFlowEntyRequest): Observable<any> {
    const url = endpoint.getCurrentMonth + '/getWorkFlowByFrequency';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log('getWorkFlow success'))
    );
  }

  exportReport(requset : PriceDataRequestForm): Observable<any> {
    const url = environment.services.document.endpoint.priceData;
    return this.http.post(url , requset, {responseType: 'blob'}).pipe(
      tap(_ => console.log('exportReport success'))
    );
  }

  exportValidatePriceDataReport(requset : PriceDataRequestForm): Observable<any> {
    const url = environment.services.document.endpoint.priceDataValidate;
    return this.http.post(url , requset, {responseType: 'blob'}).pipe(
      tap(_ => console.log('exportReport success'))
    );
  }

}
