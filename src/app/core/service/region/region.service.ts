import { regionEditRequest } from './../../../shared/models/region/request/regionEditRequest';
import { RegionAddRequest } from '../../../shared/models/region/request/regionAddRequest';
import { ProvinceResponse } from 'src/app/shared/models/responses/provinceResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RegionResponse } from 'src/app/shared/models/responses/regionResponse';

const endpoint = environment.services.region.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class RegionService {
  getApiTambol = "http://localhost:8080/ppi/api/MvtambolLike";
  constructor(
     private http:HttpClient
  ) { }
  
  createRegion(body:RegionAddRequest):Observable<any>{
    let url =  endpoint.region;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("createRegion Success"))
    )
  }
  
  deleteRegion(regionCode:string):Observable<any>{
    let url = endpoint.region;
    return this.http.request("delete",url, { body: { "regionCode": regionCode } }).pipe(
      tap(_ => console.log('deleteRegion success'))
    );
  }

  editRegion(body:regionEditRequest):Observable<any>{
    let url =  endpoint.region;
    return this.http.put(url,body,httpOptions).pipe(
      tap(_=> console.log("editRegion Success"))
    )
  }

  getAllTambol(addrStr:string):Observable<any>{
    let url = this.getApiTambol+"/"+addrStr;
    return this.http.get(url,httpOptions).pipe(
      tap(_=> console.log("getAllTambol Success"))
    )
  }

  getAllProvince():Observable<any>{
    let url = endpoint.province.province;
    return this.http.get(url,httpOptions).pipe(
      tap(_=> console.log("getAllProvince Success"))
    )
  }


  getRegion():Observable<any>{
    let url = endpoint.region;
    return this.http.get(url,httpOptions).pipe(
      tap(_=> console.log("getRegion Success"))
    )
  }

  getProvince(regionId:number):Observable<any>{
    let url = endpoint.province.byRegion+"/"+regionId;
    return this.http.get(url,httpOptions).pipe(
      tap(_=> console.log("getProvince Success"))
    )
  }

  getAmphur(provinceCode:string):Observable<any>{
    let url = endpoint.amphur.byProvince+"/"+provinceCode;
    return this.http.get(url,httpOptions).pipe(
      tap(_=> console.log("getAmphur Success"))
    )
  }

  searchProvince(str:string):Observable<any>{
    let url = endpoint.province.search+"/"+str;
    return this.http.get(url,httpOptions).pipe(
      tap(_=> console.log("searchProvince Success"))
    )
  }

}
