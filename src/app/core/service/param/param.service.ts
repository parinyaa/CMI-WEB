import { ParamGroupEditRequest } from './../../../shared/models/param/request/ParamGroupEditRequest';
import { ParamGroupCreateRequest } from './../../../shared/models/param/request/ParamGroupCreateRequest';
import { ParamInfoEditRequest } from './../../../shared/models/param/request/ParamInfoEditRequest';
import { ParamInfoCreateRequest } from './../../../shared/models/param/request/ParamInfoCreateRequest';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ParamGroup, ParamInfo} from '../../../modules/master-params/model/param';
const endpoint = environment.services.params.endpoint;

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class ParamService {

  constructor(
    private http: HttpClient
  ) {}
  inquiryAllParams():Observable<any>{
    const url = endpoint.paramGroup;
    return this.http.get(url,httpOptions).pipe(
        tap(_ => console.log("get inquiryAllparam Success"))
    )
  }

  getParamInfoByGroup(group: string): Observable<any> {
    console.log(endpoint);
    let url = endpoint.paranGroupByGroup;
    let body = { paramGroup: group };
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("getParamByGroup Success"))
    )
  }

  getParamsGroup():Observable<any>{
    let url = endpoint.paramGroup;
    return this.http.get(url,httpOptions).pipe(
     tap(_=> console.log("service getParamsGroup success"))
    )
  }

  getParamsGroupAll():Observable<any>{
    let url = endpoint.paramGroup;
    return this.http.get(url,httpOptions).pipe(
      map(
        res =>{
          localStorage.setItem('params', JSON.stringify(res));
        }
      )
    )
  }

  getParamInfo(paramGroup:string):Observable<any>{
    let url = endpoint.paramInfo + '/get-by-paramGroup';
    let body = {"paramGroup":paramGroup};
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("service getParamInfo success"))
    )
  }

  createParamInfo(body:ParamInfoCreateRequest):Observable<any>{
    let url = endpoint.paramInfo + '/insert';
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("service createParamInfo success"))
    )
  }

  deleteParamInfo(paramInfoId:number,paramCode:string):Observable<any>{
    let url = endpoint.paramInfo + '/delete';
    return this.http.request("delete",url, { body: { "paramInfoId":paramInfoId,"paramCode": paramCode } }).pipe(
      tap(_ => console.log('deleteParamInfo success'))
    );
  }

  editParamInfo(body:ParamInfoEditRequest):Observable<any>{
    let url = endpoint.paramInfo + '/edit';
    return this.http.patch(url,body,httpOptions).pipe(
      tap(_=> console.log("service editParamInfo success"))
    )
  }

  createParamGroup(body:ParamGroupCreateRequest):Observable<any>{
    let url = endpoint.paramGroup + '/insert';
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("service createParamGroup success"))
    )
  }

  deleteParamGroup(paramGroup:string):Observable<any>{
    let url = endpoint.paramGroup + '/delete';
    return this.http.request("delete",url, { body: { "paramGroup": paramGroup } }).pipe(
      tap(_ => console.log('deleteParamGroup success'))
    );
  }

  editParamGroup(body:ParamGroupEditRequest):Observable<any>{
    let url = endpoint.paramGroup + '/edit';
    return this.http.patch(url,body,httpOptions).pipe(
      tap(_=> console.log("service editParamGroup success"))
    )
  }

  getParamByGroup(param){
    let parms =  JSON.parse(localStorage.getItem('params'));
    let info = [];
    parms.forEach(element => {
      if(element.paramGroup == param){
        info = element.info;
      }
    });
    return  info;
  }

  getParamByGroupCodeAndInfoCode(groupCode: string, infoCode: string): ParamInfo {
    const params: ParamGroup[] =  JSON.parse(localStorage.getItem('params'));
    const group: ParamGroup = params.find( x => {
      return x.paramGroup === groupCode;
    });
    const info: ParamInfo = group.info.find( x => {
      return x.paramInfo === infoCode;
    });
    return info;
  }

  getParamByGroupCodeAndParamId(groupCode: string, id: number): ParamInfo {
    const params: ParamGroup[] =  JSON.parse(localStorage.getItem('params'));
    const group: ParamGroup = params.find( x => {
      return x.paramGroup === groupCode;
    });
    const info: ParamInfo = group.info.find( x => {
      return x.paramId === id;
    });
    return info;
  }

  getIamParamAll(){
    let url = endpoint.iamParam;
    return this.http.get(url,httpOptions).pipe(
      tap(_=> console.log("service getIamParamAll success"))
    )
  }
  //   findParamByParamGroup(paramGroup: string) {
  //   const listParams: any[] = JSON.parse(localStorage.getItem('params'));
  //   const paraminfo = listParams.find(x => x.cpipMsParameterGroup.paramGroup === paramGroup);
  //   console.log('param indexGroup',paraminfo);
  //   return paraminfo.paraminfoObjects;
  // }

}
