import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
const endpoint = environment.services.params.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  // findParamByParamGroup(paramGroup: string) {
  //   const listParams: any[] = JSON.parse(localStorage.getItem('params'));
  //   const paraminfo = listParams.find(x => x.cpipMsParameterGroup.paramGroup === paramGroup);
  //   return paraminfo.paraminfoObjects;
  // }
}
