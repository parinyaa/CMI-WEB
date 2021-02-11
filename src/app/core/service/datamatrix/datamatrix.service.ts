import { FilterPriceDataRequest } from './../../../shared/models/datamatrix/FilterPriceDataRequest';
import { DataMatrixCreateRequest } from './../../../shared/models/datamatrix/DataMatrixCreateRequest';
import { DataMatrixPageableRequest } from './../../../shared/models/datamatrix/DataMatrixPageableRequest';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
const endpoint = environment.services.datamatrix.endpoint.datamatrix;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class DatamatrixService {

  constructor(
    private https:HttpClient
  ) { }

  getDataMatrix(body:DataMatrixPageableRequest):Observable<any>{
    let url = endpoint+"/inquery";
     return this.https.post(url,body,httpOptions).pipe(
       tap(_=> console.log("getDataMatrix success"))
     )
  }

  getDataMatrixALl():Observable<any>{
    let url = endpoint;
     return this.https.get(url,httpOptions).pipe(
       tap(_=> console.log("getDataMatrix success"))
     )
  }

  createDataMatrix(body:DataMatrixCreateRequest):Observable<any>{
    let url = endpoint;
     return this.https.post(url,body,httpOptions).pipe(
       tap(_=> console.log("createDataMatrix success"))
     )
  }

  filterPrice(body:FilterPriceDataRequest):Observable<any>{
    let url = endpoint+"/filterdata";
     return this.https.post(url,body,httpOptions).pipe(
       tap(_=> console.log("filterPrice success"))
     )
  }

}
