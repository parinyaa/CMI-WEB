import { SopCreateRequest } from './../../../shared/models/soptree/request/SopCreateRequest';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SopEditRequest } from 'src/app/shared/models/soptree/request/SopEditRequest';

const endpoint = environment.services.sopTree.endpoint.ppiTree;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class SoptreeService {


  constructor(
    private http: HttpClient
  ) { }

  getSopTree(parentId: number): Observable<any> {
    let url = endpoint + "/" + parentId;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getSopTree success"))
    )
  }

  createSopTree(body: SopCreateRequest): Observable<any> {
    let url = endpoint;
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("createSopTree success"))
    )
  }

  deleteNode(node: number): Observable<any> {
    let url = endpoint;
    return this.http.request("delete", url, { body: { "sopId": node } }).pipe(
      tap(_ => console.log('deleteNode success'))
    );
  }

  editSopTree(body: SopEditRequest): Observable<any> {
    let url = endpoint;
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log("editSopTree success"))
    )
  }





}
