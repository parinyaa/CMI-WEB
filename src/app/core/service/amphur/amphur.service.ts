import { AmphurEditRequest } from './../../../shared/models/request/amphurEditRequest';
import { AmphurAddRequest } from './../../../shared/models/request/amphurAddRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const endpoint = environment.services.region.endpoint.amphur;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class AmphurService {

  constructor(
    private http:HttpClient
  ) { }

  
  getAmphurByAmphurId(amphurId:number):Observable<any>{
    let url = endpoint.amphur+"/"+amphurId;
    return this.http.get(url,httpOptions).pipe
    (tap(_=> console.log("getAmphurByAmphurCode success")));
  }

  createAmphur(req:AmphurAddRequest):Observable<any>{
    let url = endpoint.amphur;
    return this.http.post(url,req,httpOptions).pipe
    (tap(_=> console.log("createAmphur success")));
  }

  deleteAmphur(amphurCode:string,provinceId:number):Observable<any>{
    let url = endpoint.amphur;
    return this.http.request("delete",url, { body: { "amphurCode": amphurCode,"provinceId":provinceId } }).pipe(
      tap(_ => console.log('deleteAmphur success'))
    );
  }
  
  updateAmphur(req:AmphurEditRequest):Observable<any>{
    let url = endpoint.amphur;
    return this.http.put(url,req,httpOptions).pipe
    (tap(_=> console.log("updateAmphur success")));
  }
  

}
