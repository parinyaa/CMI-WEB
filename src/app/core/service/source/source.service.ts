import { SourceEditRequest } from './../../../shared/models/source/request/sourceeditrequest';
import { SurveyPageableRequest } from './../../../shared/models/survey/request/surveypageablerequest';
import { SourceCreateRequest } from './../../../shared/models/source/request/sourceCreateRequest';
import { SourceCreateDefaultRequest } from './../../../shared/models/source/request/sourceCreateDefaultRequest';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { SourcePageableRequest } from 'src/app/shared/models/source/request/sourcepageablerequest';
import { SourceAllReqest } from 'src/app/shared/models/source/request/sourceAllRequestModel';
const endpoint = environment.services.source.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor(
    private http:HttpClient
  ) { }

  createSourceDefault(request:string):Observable<any>{
    let url = endpoint.sourcedefault;
    return this.http.post(url,request,httpOptions).pipe(
      tap( _=> console.log("createSourceDefault success"))
    )
  }

  createSource(body:SourceCreateRequest):Observable<any>{
    let url = endpoint.source+"/create";
    return this.http.post(url,body,httpOptions).pipe(
      tap( _=> console.log("createSource success"))
    )
  }

  getSource(body:SourcePageableRequest):Observable<any>{
    let url = endpoint.source+"/inquiryBySource";
    return this.http.post(url,body,httpOptions).pipe(
      tap( _=> console.log("getSource success"))
    )
  }

  getSourceInquiry(body:SourcePageableRequest):Observable<any>{
    let url = endpoint.source+"/inquiry";
    return this.http.post(url,body,httpOptions).pipe(
      tap( _=> console.log("getSource success"))
    )
  }

  getAllSource(body:SourceAllReqest):Observable<any>{
    let url = endpoint.source+"/all";
    return this.http.post(url,body,httpOptions).pipe(
      tap( _=> console.log("getSource success"))
    )
  }
  
  editSource(body:SourceEditRequest):Observable<any>{
    let url = endpoint.source+"/edit";
    return this.http.put(url,body,httpOptions).pipe(
      tap( _=> console.log("editSource success"))
    )
  }

  deleteSource(sourceCode:string):Observable<any>{
    let url = endpoint.source+"/delete";
    return this.http.request("delete",url, { body: { "sourceCode": sourceCode } }).pipe(
      tap(_ => console.log('deleteSurvey success'))
    );
  }


}
