import { BasePriceResponse, FilterBasePiceRequest, CpaNewBasePrice, BasePriceByCpaResponse } from './../../../shared/models/basePrice/basePrice';
import { tap } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvgBaseWeightReq } from 'src/app/modules/create-info-baseyear/models/request-param';
const endpont = environment.services.basePrice.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class BasepriceService {

  constructor(
    private https:HttpClient,
  ) { }

  getBasePrice( Filter:FilterBasePiceRequest, page: number, size: number):Observable<BasePriceResponse>{
    let url = endpont.basePrice + '?page=' + page + '&size=' + size;
    return this.https.post<BasePriceResponse>(url,Filter,httpOptions).pipe(
      tap(_ => console.log('getBasePrice success'))
    )
  }

  getCpaNewBasePrice(request : AvgBaseWeightReq):Observable<any>{
    let url = endpont.basePrice + "/findcpanewbaseprice";
    return this.https.post(url,request,httpOptions).pipe(
      tap(_ => console.log('getCpaNewBasePrice success'))
    )

  }

  updateBasePrice(request:any):Observable<any>{
    let url = endpont.basePrice + "/updatebaseprice";
    return this.https.post(url,request,httpOptions).pipe(
      tap(_ => console.log('updateBasePrice success'))
    )
  }

  updateNewBasePrice(request:any):Observable<any>{
    let url = endpont.basePrice + "/updateNewBasePrice";
    return this.https.post(url,request,httpOptions).pipe(
      tap(_ => console.log('updateNewBasePrice success'))
    )
  }

  updateNewBaseImportPrice(request:any):Observable<any>{
    let url = endpont.basePrice + "/updateNewBaseImportPrice";
    return this.https.post(url,request,httpOptions).pipe(
      tap(_ => console.log('updateNewBaseImportPrice success'))
    )
  }

  
  getSelectBasePrice( Filter:FilterBasePiceRequest, page: number, size: number):Observable<BasePriceResponse>{
    let url = endpont.basePrice+"/selectbaseprice" + '?page=' + page + '&size=' + size;
    return this.https.post<BasePriceResponse>(url,Filter,httpOptions).pipe(
      tap(_ => console.log('getSelectBasePrice success'))
    )
  }

  getBasePriceByCpa( request : any):Observable<BasePriceByCpaResponse[]>{
    let url = endpont.basePrice+"/findBasePriceByCpa";
    return this.https.post<BasePriceByCpaResponse[]>(url,request,httpOptions).pipe(
      tap(_ => console.log('getBasePriceByCpa success'))
    )
  }

  checkNextStepStage45():Observable<any>{
    let url = endpont.basePrice+"/checkNextStepStage45";
      return this.https.get(url,httpOptions).pipe(
      tap(_ => console.log('checkNextStepStage45 success'))
    )
  }


  

}
