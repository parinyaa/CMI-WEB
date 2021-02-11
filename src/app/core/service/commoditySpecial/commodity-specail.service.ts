import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommoditySpecialModel, CommodityNotInSpecialRequest, UpdateCommoditySpacialMappingRequest } from 'src/app/shared/models/commoditySpecial/CommoditySpecial';
import { PageableResponse } from 'src/app/shared/response';
const endpoint = environment.services.commoditySpecial.endpoint

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8',
  }),
};
@Injectable({
  providedIn: 'root'
})
export class CommoditySpecailService {

  constructor(
    private http: HttpClient
  ) { }

  public inquireCommoditySpecialList(): Observable<CommoditySpecialModel[]> {
    let url = endpoint.inquiryDropDown;
    return this.http.get<CommoditySpecialModel[]>(url, httpOptions).pipe(tap((_) => console.log('inquireCommoditySpecialList success')));
  }

  public inquireCommodityNotInSpecialList(request: CommodityNotInSpecialRequest, page: number, size: number): Observable<PageableResponse> {
    let url = endpoint.inquiryCommodityList + '?page=' + page + '&size=' + size;
    return this.http.post<PageableResponse>(url, request, httpOptions).pipe(tap((_) => console.log('inquireCommodityNotInSpecialList success')));
  }

  public inquireCommodityMappingSpecialList(request: CommodityNotInSpecialRequest, page: number, size: number): Observable<PageableResponse> {
    let url = endpoint.inquiryCommodityMappingList + '?page=' + page + '&size=' + size;
    return this.http.post<PageableResponse>(url, request, httpOptions).pipe(tap((_) => console.log('inquireCommodityMappingSpecialList success')));
  }

  public updateCommodityMappingSpecial(request: UpdateCommoditySpacialMappingRequest): Observable<any> {
    let url = endpoint.update;
    return this.http.post(url, request, httpOptions).pipe(tap((_) => console.log('updateCommodityMappingSpecial success')));
  }

}
