import { SurveyEditRequest } from './../../../shared/models/survey/request/surveyEditRequest';
import { SurveyPageableRequest } from './../../../shared/models/survey/request/surveypageablerequest';
import { SurveyAddRequest } from 'src/app/shared/models/survey/request/surveyaddrequest';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
const endpoint = environment.services.survey.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(
    private http:HttpClient
  ) { }

  createSurvey(body:SurveyAddRequest):Observable<any>{
    let url = endpoint.survey+"/create";
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("createSurvey Success"))
    )
  }

  editSurvey(body:SurveyEditRequest):Observable<any>{
    let url = endpoint.survey+"/edit";
    return this.http.put(url,body,httpOptions).pipe(
      tap(_=> console.log("createSurvey Success"))
    )
  }

  getSurvey(body:SurveyPageableRequest):Observable<any>{
    let url = endpoint.survey+"/inquiry";
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("getSurvey Success"))
    )
  }

  deleteSurvey(surveyCode:string):Observable<any>{
    let url = endpoint.survey+"/delete";
    return this.http.request("delete",url, { body: { "surveyCode": surveyCode } }).pipe(
      tap(_ => console.log('deleteSurvey success'))
    );
  }

}
