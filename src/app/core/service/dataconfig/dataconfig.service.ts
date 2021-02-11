import { DataConfigSearchRequest } from './../../../shared/models/dataconfig/DataConfigSearchRequest';
import { DataConfigPageRequest } from './../../../shared/models/dataconfig/DataConfigPageRequest';
import { environment } from './../../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CpipMsDadaConfigRequest, DataConfigCreateRequest } from './../../../shared/models/dataconfig/DataConfigCreateRequest';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const endpoint = environment.services.dataconfig.endpoint.dataConfig;
const endpointMaping = environment.services.dataconfig.endpoint.getMappingDataConfig;

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class DataconfigService {

  constructor(
    private http: HttpClient
  ) { }

  createDataConfig(body: DataConfigCreateRequest): Observable<any> {
    let url = endpoint;
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("createDataConfig success"))
    )
  }

  getDataConfig(body: number): Observable<any> {
    let url = endpoint + "/" + body;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getDataConfig success"))
    )
  }

  getMappingDataConfig(body: CpipMsDadaConfigRequest): Observable<any> {
    let url = endpointMaping;
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("getMappingDataConfig success"))
    )
  }

  getDataConfigPageable(body: DataConfigSearchRequest): Observable<any> {
    let url = endpoint + "/search?page=" + body.page + "&pageSize=" + body.pageSize + "&searchType=" + body.searchType + "&province=" + body.province + "&commodityCode=" + body.commodityCode
      + "&commodityThName=" + body.commodityThName + "&sourceName=" + body.sourceName;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getDataConfigPageable success"))
    )
  }

  // getDataConfigPageable(body:DataConfigPageRequest):Observable<any>{
  //   let url = endpoint+"/getdataconfig";
  //   return this.http.post(url,body,httpOptions).pipe(
  //     tap(_=> console.log("getDataConfigPageable success"))
  //   )
  // }

  deleteDataConfig(id: number): Observable<any> {
    let url = endpoint + `/delete/${id}`;
    return this.http.delete(url, httpOptions).pipe(
      tap(_ => console.log("deleteDataConfig success"))
    )
  }



}
