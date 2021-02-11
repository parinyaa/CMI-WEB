import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InquiryWeightMaoppingRequest, UpdateWeightMappingRequest, DeletedWeightMappingRequest } from 'src/app/shared/models/weight/request/WeightMapping';

const endpoint = environment.services.weightMapping.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class WeightMappingService {

  constructor(
    private http: HttpClient
  ) { }

  inquiryWeightMapping(request: InquiryWeightMaoppingRequest, pageIndex: number, pageSize: number): Observable<any> {
    let url = endpoint + "/inquiry?page=" + pageIndex + "&size=" + pageSize;
    return this.http.post(url, request, httpOptions).pipe(
      tap(_ => console.log("inquiryWeightMapping success"))
    );
  }

  inquiryCommodityCode(): Observable<any> {
    let url = endpoint + "/inquiry/commodity"
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("inquiryCommodityCode success"))
    );
  }


  updateWeightMapping(request: UpdateWeightMappingRequest): Observable<any> {
    let url = endpoint + "/update"
    return this.http.post(url, request, httpOptions).pipe(
      tap(_ => console.log("updateWeightMapping success"))
    );
  }

  deletedWeightMapping(request: DeletedWeightMappingRequest): Observable<any> {
    let url = endpoint + "/deleted"
    return this.http.post(url, request, httpOptions).pipe(
      tap(_ => console.log("deletedWeightMapping success"))
    );
  }

}
