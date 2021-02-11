import { StakeholderEditRequest } from './../../../shared/models/stakeholder/request/stakeholderEditRequest';
import { StakeholderAddRequest } from './../../../shared/models/stakeholder/request/stakeholderaddrequest';
import { StakeholderPageableRequest } from './../../../shared/models/stakeholder/request/stakeholderpageablerequest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
const endpoint = environment.services.stakeholder.endpoint;
@Injectable({
  providedIn: 'root'
})
export class StakeholderService {

  constructor(
    private http:HttpClient
  ) { }

  getStakeholder(body:StakeholderPageableRequest):Observable<any>{
    let url = endpoint.stakeholder+"/inquiry";
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("getStakeholder Success"))
    )
  }

  createStakeholder(body:StakeholderAddRequest):Observable<any>{
    let url = endpoint.stakeholder+"/create";
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("createStakeholder Success"))
    )
  }

  deleteStakeholder(stakeholderCode:string):Observable<any>{
    let url = endpoint.stakeholder+"/delete";
    return this.http.request("delete",url, { body: { "stakeholderCode": stakeholderCode } }).pipe(
      tap(_ => console.log('deleteStakeholder success'))
    );
  }

  editStakeholder(body:StakeholderEditRequest):Observable<any>{
    let url = endpoint.stakeholder+"/edit";
    return this.http.put(url,body,httpOptions).pipe(
      tap(_=> console.log("editStakeholder Success"))
    )
  }
}
