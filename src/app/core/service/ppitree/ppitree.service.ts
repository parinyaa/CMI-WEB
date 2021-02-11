import { ExportSourceByCpaRequest, FilterCpaMinus } from './../../../shared/models/dataconfig/DataConfigCreateRequest';
import { RequestParam } from './../../../modules/create-info-baseyear/models/request-param';
import { CpaPageableRequset } from './../../../shared/models/ppitree/request/CpaPageableRequest';
import { PpiEditRequest } from './../../../shared/models/ppitree/request/PpiEditRequest';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { PpiCreateRequest } from 'src/app/shared/models/ppitree/request/PpiCreateRequest';
import { FilterCpaMinusSource } from 'src/app/shared/models/dataconfig/DataConfigCreateRequest';
import { CpipGetParentIdRequest } from 'src/app/shared/models/ppitree/request/CpipGetParentIdRequest';


const endpoint = environment.services.ppiTree.endpoint;
const endpointExport = environment.services.export.endpoint.sourceCpip;

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class PpitreeService {

  constructor(
    private http:HttpClient
  ) { }

  getPpiTree(parentId:string):Observable<any>{
    let url = endpoint.ppiTree+"/"+parentId;
    return this.http.get(url,httpOptions).pipe(
      tap(_ => console.log("getPpiTree success") )
    )
  }

  getCpipTree(body:CpipGetParentIdRequest):Observable<any>{
    let url = endpoint.ppiTree+"/inquiry";
    return this.http.post(url,body,httpOptions).pipe(
      tap(_ => console.log("getCpipTree success") )
    )
  }

  createPpiTree(body:PpiCreateRequest):Observable<any>{
    let url = endpoint.ppiTree;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_ => console.log("getPpiTree success") )
    )
  }

  deleteNode(node:number):Observable<any>{
    let url = endpoint.ppiTree;
    return this.http.request("delete",url, { body: { "ppiId": node } }).pipe(
      tap(_ => console.log('deleteNode success'))
    );
  }

  editNode(body:PpiEditRequest):Observable<any>{
    let url = endpoint.ppiTree;
    return this.http.put(url,body,httpOptions).pipe(
      tap(_ => console.log("editNode success") )
    )
  }

  getCpaList():Observable<any>{
    let url = endpoint.ppiTree+"/cpa";
    return this.http.get(url,httpOptions).pipe(
      tap(_ => console.log("getCpaList success") )
    )
  }

  getCpaBySource(body:FilterCpaMinusSource , page : number , size : number):Observable<any>{
    let url = endpoint.ppiTree+'/cpa'  + '?page=' + page + '&size=' + size;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("getCpaBySource succcess"))
    )
  }

  getCpaPageable(body:CpaPageableRequset):Observable<any>{
    let url = endpoint.ppiTree+'/cpa/pageable';
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("getCpaPageable succcess"))
    )
  }

  getSourceByCpa(body:FilterCpaMinus, page : number , size : number):Observable<any>{
    let url = endpoint.ppiTree+'/sourcecpa' + '?page=' + page + '&size=' + size;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("getSourceByCpa succcess"))
    )
  }

  exportSourceByCpa(req: ExportSourceByCpaRequest): Observable<any> {
    const url = endpointExport;
    return this.http.post(url, req, {
      responseType: 'blob'
    }).pipe(
      tap(_ => console.log('exportSourceByCpa Success'))
    );
  }



}
