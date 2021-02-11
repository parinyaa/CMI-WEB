import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InsertWeightDataRequest } from 'src/app/shared/models/weight/request/InsertWeightDataRequest';
import { DeleteWeightDataRequest } from 'src/app/shared/models/weight/request/DeleteWeightDataRequest';
import { OtherActionWeightDataRequest } from 'src/app/shared/models/weight/request/OtherActionWeightDataRequest.model';
import { CancelWeightStepRequest } from 'src/app/shared/models/weight/request/CancelWeightStepRequest.model';
import { CalculateWeightNextStepRequest } from 'src/app/shared/models/weight/request/CalculateWeightNextStepRequest.model';
import { InsertAndUpdateMappingCPAWithWeightRequest } from 'src/app/shared/models/weight/request/InsertAndUpdateMappingCPAWithWeightRequest.model';
import { InsertWeightCPARequest } from 'src/app/shared/models/weight/request/InsertWeightCPARequest.model';
import { lstatSync } from 'fs';

const endpoint = environment.services.weight.endpoint;
let httpOptions = {};

@Injectable({
  providedIn: 'root'
})
export class WeightService {

  constructor(
    private http: HttpClient
  ) {
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8'
      })
    }
  }

  getBaseYear(): Observable<any> {
    let url = endpoint + '/baseyear/getall';
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getBaseYear Success"))
    )
  }

  insertWeightData(body: InsertWeightDataRequest): Observable<any> {
    let url = endpoint + '/data/insert';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("insertWeightData Success"))
    )
  }

  getWeightAndWeightDataByBaseYear(id, status, page: number, size: number, step: number): Observable<any> {
    let url = endpoint + '/getbybaseyear/' + id + '/' + status + '/step/' + step + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightAndWeightDataByBaseYear Success"))
    )
  }

  getWeightAndWeightDataByBaseYearAndNotDataId(id, page: number, size: number, step: number, dataId: number): Observable<any> {
    let url = endpoint + '/baseyear/' + id + '/data/' + dataId + '/step/' + step + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightAndWeightDataByBaseYearAndNotDataId Success"))
    )
  }

  deleteActionWeightDataById(body: DeleteWeightDataRequest): Observable<any> {
    let url = endpoint + '/data/action/delete';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("deleteActionWeightDataById Success"))
    )
  }

  otherActionWeightDataById(body: OtherActionWeightDataRequest): Observable<any> {
    let url = endpoint + '/data/action/other';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("otherActionWeightDataById Success"))
    )
  }

  getWeightStepByBaseYear(id, step): Observable<any> {
    let url = endpoint + '/step/getbybaseyear/' + id + '/step/' + step;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightStepByBaseYear Success"))
    )
  }

  getWeightHistoryByWeightStep(id): Observable<any> {
    let url = endpoint + '/history/getbystep/' + id;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightHistoryByWeightStep Success"))
    )
  }

  cancelWeightStepById(body: CancelWeightStepRequest): Observable<any> {
    let url = endpoint + '/step/cancel';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("cancelWeightStepById Success"))
    )
  }

  getWeightDataChildrenForMapping(id, page: number, size: number): Observable<any> {
    let url = endpoint + '/data/get/child/' + id + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightDataChildrenForMapping Success"))
    )
  }

  calculateWeightNextStep(body: CalculateWeightNextStepRequest): Observable<any> {
    let url = endpoint + '/nextstep';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("calculateWeightNextStep Success"))
    )
  }

  getCPALevel7(weightId: number, weightDataId: number): Observable<any> {
    let url = endpoint + '/get/cpa/mapping/' + weightId + '/' + weightDataId ;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getCPALevel7 Success"))
    )
  }

  mappingCPAWithWeight(body: InsertAndUpdateMappingCPAWithWeightRequest): Observable<any> {
    let url = endpoint + '/mapping/cpa';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("mappingCPAWithWeight Success"))
    )
  }

  exportExcelWeighCPA(weightId: number): Observable<any> {
    const url = environment.services.weight.export + '/excel/' + weightId;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log("exportExcelWeighCPA Success"))
    )
  }

  deleteWeight(id: number): Observable<any> {
    let url = endpoint + '/delete/' + id;
    return this.http.delete(url, httpOptions).pipe(
      tap(_ => console.log("deleteWeight Success"))
    )
  }

  getWeightByBaseYearAndStatus(id, status): Observable<any> {
    let url = endpoint + '/getbybaseyear/' + id + '/' + status;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightByBaseYearAndStatus Success"))
    )
  }

  getWeightDataByWeightId(id, page: number, size: number, step: number): Observable<any> {
    let url = endpoint + '/getbybaseyear/' + id + '/step/' + step + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightDataByBaseYear Success"))
    )
  }

  copyDataWeightCPA(id): Observable<any> {
    let url = endpoint + '/cpa/copy/' + id;
    return this.http.put(url, httpOptions).pipe(
      tap(_ => console.log("copyDataWeightCPA Success"))
    )
  }

  insertDataWeightCPA(body: InsertWeightCPARequest): Observable<any> {
    let url = endpoint + '/cpa/insert';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("copyDataWeightCPA Success"))
    )
  }

  getTrWeightCPAByWeightId(id, page: number, size: number): Observable<any> {
    let url = endpoint + '/cpa/tr/weightId/' + id + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getTrWeightCPAByWeightId Success"))
    )
  }

  sumChildrenWeight(id): Observable<any> {
    let url = endpoint + '/sum/child/' + id;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("sumChildrenWeight Success"))
    )
  }

}
