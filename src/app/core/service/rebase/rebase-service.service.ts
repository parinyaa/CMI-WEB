import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CurrentStage } from '../../../modules/create-info-baseyear/models/current-stage';
import {
  AvgBaseWeight,
  BaseIndex,
  BasePrice,
  BaseWeight, CpaIndex, CpaWeight,
  RebaseIndex,
  ResponseData, SopAvgIndex, SopAvgWeight, SopIndex, SopWeight, TrSopIndex, TrSopWeight, AvgBaseIndex
} from '../../../modules/create-info-baseyear/models/response-data';
import { RequestParam, AvgBaseWeightReq } from '../../../modules/create-info-baseyear/models/request-param';
import { UpdateNextStageRequest } from 'src/app/modules/create-info-baseyear/models/update-next-stage-request';
import { ResetRebaseRequest } from 'src/app/shared/models/baseYear/baseYear';

const endpoint = environment.services.rebase.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class RebaseServiceService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getCurrentStage(req: UpdateNextStageRequest): Observable<CurrentStage> {
    const url = endpoint.currentStage;
    // return this.http.get<CurrentStage>(url, httpOptions).pipe(
    //   tap(_ => console.log('getCurrentStage success'))
    // );
    return this.http.post<CurrentStage>(url, req, httpOptions).pipe(
      tap(_ => console.log('getCurrentStage success'))
    );
  }

  public nextStage(req: UpdateNextStageRequest): Observable<CurrentStage> {
    const url = endpoint.nextStage;
    return this.http.post<CurrentStage>(url, req, httpOptions).pipe(
      tap(_ => console.log('nextStage success'))
    );
  }

  public prevStage(): Observable<CurrentStage> {
    const url = endpoint.prevStage;
    return this.http.post<CurrentStage>(url, null, httpOptions).pipe(
      tap(_ => console.log('prevStage success'))
    );
  }

  public getAvgBaseWeight(param: RequestParam): Observable<ResponseData<AvgBaseWeight>> {
    const url = endpoint.avgBaseWeight;
    return this.http.post<ResponseData<AvgBaseWeight>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getAvgBaseWeight success'))
    );
  }

  exportAvgBaseWeight(param: AvgBaseWeightReq): Observable<any> {
    const url = endpoint.exportAvgBaseWeight;
    return this.http.post(url, param, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportAvgBaseWeight Success'))
    );
  }

  public getBasePrice(param: RequestParam): Observable<ResponseData<BasePrice>> {
    const url = endpoint.basePrice;
    return this.http.post<ResponseData<BasePrice>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getBasePrice success'))
    );
  }

  exportBasePrice(param: AvgBaseWeightReq): Observable<any> {
    const url = endpoint.exportBasePrice;
    return this.http.post(url, param, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportBasePrice Success'))
    );
  }

  public getBaseWeight(param: RequestParam): Observable<ResponseData<BaseWeight>> {
    const url = endpoint.baseWeight;
    return this.http.post<ResponseData<BaseWeight>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getBaseWeight success'))
    );
  }

  exportBaseWeight(param: AvgBaseWeightReq): Observable<any> {
    const url = endpoint.exportBaseWeight;
    return this.http.post(url, param, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportBaseWeight Success'))
    );
  }

  exportBasePriceBar(param: AvgBaseWeightReq): Observable<any> {
    const url = endpoint.exportBasePriceBar;
    return this.http.post(url, param, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportBasePriceBar Success'))
    );
  }

  public getBaseIndex(param: RequestParam): Observable<ResponseData<BaseIndex>> {
    const url = endpoint.baseIndex;
    return this.http.post<ResponseData<BaseIndex>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getBaseIndex success'))
    );
  }

  exportBaseIndex(param: AvgBaseWeightReq): Observable<any> {
    const url = endpoint.exportBaseIndex;
    return this.http.post(url, param, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportBaseIndex Success'))
    );
  }

  public getRebaseIndex(param: RequestParam): Observable<ResponseData<RebaseIndex>> {
    const url = endpoint.rebaseIndex;
    return this.http.post<ResponseData<RebaseIndex>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getRebaseIndex success'))
    );
  }

  exportRebaseIndex(param: AvgBaseWeightReq): Observable<any> {
    const url = endpoint.exportRebaseIndex;
    return this.http.post(url, param, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportRebaseIndex Success'))
    );
  }

  exportIndexBaseYear(param: AvgBaseWeightReq): Observable<any> {
    const url = endpoint.exportIndexBaseYear;
    return this.http.post(url, param, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportIndexBaseYear Success'))
    );
  }

  public getCpaIndex(param: RequestParam): Observable<ResponseData<CpaIndex>> {
    const url = endpoint.cpaIndex;
    return this.http.post<ResponseData<CpaIndex>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getCpaIndex success'))
    );
  }

  exportCpaIndex(): Observable<any> {
    const url = endpoint.exportCpaIndex;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportCpaIndex Success'))
    );
  }

  public getCpaWeight(param: RequestParam): Observable<ResponseData<CpaWeight>> {
    const url = endpoint.cpaWeight;
    return this.http.post<ResponseData<CpaWeight>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getCpaWeight success'))
    );
  }

  exportCpaWeight(): Observable<any> {
    const url = endpoint.exportCpaWeight;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportCpaWeight Success'))
    );
  }

  public getSopAvgWeight(param: RequestParam): Observable<ResponseData<SopAvgWeight>> {
    const url = endpoint.sopAvgWeight;
    return this.http.post<ResponseData<SopAvgWeight>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getSopAvgWeight success'))
    );
  }

  exportSopAvgWeight(): Observable<any> {
    const url = endpoint.exportSopAvgWeight;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportSopAvgWeight Success'))
    );
  }

  public getSopWeight(param: RequestParam): Observable<ResponseData<SopWeight>> {
    const url = endpoint.sopWeight;
    return this.http.post<ResponseData<SopWeight>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getSopWeight success'))
    );
  }

  exportSopWeight(): Observable<any> {
    const url = endpoint.exportSopWeight;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportSopWeight Success'))
    );
  }

  public getSopIndex(param: RequestParam): Observable<ResponseData<SopIndex>> {
    const url = endpoint.sopIndex;
    return this.http.post<ResponseData<SopIndex>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getSopIndex success'))
    );
  }

  exportSopIndex(): Observable<any> {
    const url = endpoint.exportSopIndex;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportSopIndex Success'))
    );
  }

  public getSopAvgIndex(param: RequestParam): Observable<ResponseData<SopAvgIndex>> {
    const url = endpoint.sopAvgIndex;
    return this.http.post<ResponseData<SopAvgIndex>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getSopAvgIndex success'))
    );
  }

  exportSopAvgIndex(): Observable<any> {
    const url = endpoint.exportSopAvgIndex;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportSopAvgIndex Success'))
    );
  }

  public getSopRebaseIndex(param: RequestParam): Observable<ResponseData<RebaseIndex>> {
    const url = endpoint.sopRebaseIndex;
    return this.http.post<ResponseData<RebaseIndex>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getSopRebaseIndex success'))
    );
  }

  exportSopRebaseIndex(): Observable<any> {
    const url = endpoint.exportSopRebaseIndex;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportSopRebaseIndex Success'))
    );
  }

  public getTrSopWeight(param: RequestParam): Observable<ResponseData<TrSopWeight>> {
    const url = endpoint.trSopWeight;
    return this.http.post<ResponseData<TrSopWeight>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getTrSopWeight success'))
    );
  }

  exportTrSopWeight(): Observable<any> {
    const url = endpoint.exportTrSopWeight;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportTrSopWeight Success'))
    );
  }

  public getTrSopIndex(param: RequestParam): Observable<ResponseData<TrSopIndex>> {
    const url = endpoint.trSopIndex;
    return this.http.post<ResponseData<TrSopIndex>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getTrSopIndex success'))
    );
  }

  exportTrSopIndex(): Observable<any> {
    const url = endpoint.exportTrSopIndex;
    return this.http.get(url, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportTrSopIndex Success'))
    );
  }

  public getAvgBaseIndex(param: RequestParam): Observable<ResponseData<AvgBaseIndex>> {
    const url = endpoint.avgBaseIndex;
    return this.http.post<ResponseData<AvgBaseIndex>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getAvgBaseIndex success'))
    );
  }

  public getPublicCpiWeight(param: RequestParam): Observable<ResponseData<any>> {
    const url = endpoint.getPublicCpiWeight;
    return this.http.post<ResponseData<any>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getPublicCpiWeight success'))
    );
  }

  public getPublicCpiIndex(param: RequestParam): Observable<ResponseData<any>> {
    const url = endpoint.getPublicCpiIndex;
    return this.http.post<ResponseData<any>>(url, param, httpOptions).pipe(
      tap(_ => console.log('getPublicCpiIndex success'))
    );
  }


  exportPublicCpiWeight(param: AvgBaseWeightReq): Observable<any> {
    const url = endpoint.exportPublicCpiWeight;
    return this.http.post(url, param, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportPublicCpiWeight Success'))
    );
  }

  exportPublicCpiIndex(param: AvgBaseWeightReq): Observable<any> {
    const url = endpoint.exportPublicCpiIndex;
    return this.http.post(url, param, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportPublicCpiIndex Success'))
    );
  }

  resetRebase(param: ResetRebaseRequest): Observable<any> {
    const url = endpoint.resetRebase;
    return this.http.post(url, param, httpOptions).pipe(
      tap(_ => console.log('resetRebase success'))
    );
  }




}
