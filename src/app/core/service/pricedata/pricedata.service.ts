import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { PriceDataList } from '../../../shared/models/dataenty/request/PricDataList';
import { PriceDataRequestForm } from '../../../shared/models/dataenty/request/PriceDataRequestForm';
import { BaseYear } from '../../../shared/models/dataenty/request/BaseYear';
import { NeighborhoodResponse } from '../../../modules/keyin-data/model/neighborhoodResponse';
import { CurrencyRate } from '../../../modules/keyin-data/model/currencyRate';
import {
  InboxDetail,
  AddPriceDataRequest,
  ListGroupCpipRequest,
} from '../../../modules/commodity-validate/models/inbox-details';

const endpoint = environment.services.priceData.endpoint.frequency;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class PricedataService {
  constructor(private http: HttpClient) { }

  getCurrentPriceData(
    requestForm: PriceDataRequestForm,
    page: number,
    size: number,
  ): Observable<any> {
    const url =
      endpoint.getPriceDataByFrequency +
      '/' +
      requestForm.frequency +
      '?page=' +
      page +
      '&size=' +
      size;
    return this.http
      .post(url, requestForm, httpOptions)
      .pipe(tap((_) => console.log('getPriceData success')));
  }

  getNeighborhoodPrice(
    cpaParentId: number,
    baseYearId: number,
    yearTerm: number,
    monthTerm: number,
    dataMatrixId: number,
    page: number,
    size: number,
  ): Observable<NeighborhoodResponse> {
    const url =
      endpoint.neighborhood +
      '?cpaParentId=' +
      cpaParentId +
      '&baseYearId=' +
      baseYearId +
      '&yearTerm=' +
      yearTerm +
      '&monthTerm=' +
      monthTerm +
      '&dataMatrixId=' +
      dataMatrixId +
      '&page=' +
      page +
      '&size=' +
      size;
    return this.http
      .get<NeighborhoodResponse>(url, httpOptions)
      .pipe(tap((_) => console.log('getNeighborhoodPrice success')));
  }
  savePriceData(body: PriceDataList): Observable<any> {
    const url = endpoint.save;
    return this.http
      .post(url, body, httpOptions)
      .pipe(tap((_) => console.log('savePriceData success')));
  }

  getYearTermList(): Observable<number[]> {
    const url = endpoint.yearTermList;
    return this.http
      .get<number[]>(url, httpOptions)
      .pipe(tap((_) => console.log('getYearTermList')));
  }
  getBaseYearList(): Observable<BaseYear[]> {
    const url = endpoint.baseYearList;
    return this.http
      .get<BaseYear[]>(url, httpOptions)
      .pipe(tap((_) => console.log('getBaseYearList')));
  }
  getCurrencyRate(): Observable<CurrencyRate[]> {
    const url = endpoint.currencyRate;
    return this.http
      .get<CurrencyRate[]>(url, httpOptions)
      .pipe(tap((_) => console.log('getCurrencyRate')));
  }

  createPriceDataFromInspect(items: AddPriceDataRequest): Observable<any> {
    const url = endpoint.createPriceData;
    return this.http
      .post(url, items, httpOptions)
      .pipe(tap((_) => console.log('createPriceDataFromInspect success')));
  }

  inquireGroupList(req:ListGroupCpipRequest): Observable<any> {
    const url = endpoint.grouplist;
    return this.http
      .post(url, req, httpOptions)
      .pipe(tap((_) => console.log('inquireGroupList success')));
  }
}
