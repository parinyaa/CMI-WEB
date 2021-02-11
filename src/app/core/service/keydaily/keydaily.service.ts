import { CommemtSaveRequest } from './../../../shared/models/datadaily/CommentSaveRequest';
import { DailySaveRequest } from './../../../shared/models/datadaily/DailySaveRequest';
import { GetDataDailyRequest } from './../../../shared/models/datadaily/GetDataDailyRequest';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
const endpoint = environment.services.dataEnty.endpoint.daily.getDaily;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class KeydailyService {

  constructor(
    private http:HttpClient
  ) { }

  getDataDaily(body:GetDataDailyRequest):Observable<any>{
    let url = endpoint;
     return this.http.post(url,body,httpOptions).pipe(
       tap(_=> console.log("getDataDaily success"))
     )
  }

  saveDaily(body:DailySaveRequest):Observable<any>{
    let url = endpoint+"/savedaily";
     return this.http.post(url,body,httpOptions).pipe(
       tap(_=> console.log("saveDaily success"))
     )
  }

  saveComment(body:CommemtSaveRequest):Observable<any>{
    let url = endpoint+"/savecomment";
     return this.http.post(url,body,httpOptions).pipe(
       tap(_=> console.log("saveComment success"))
     )
  }

  

}
