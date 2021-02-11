import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AddDocumentRequest } from 'src/app/shared/models/document/request/AddDocumentRequest';

import { GetDocumentRequest } from 'src/app/shared/models/document/request/GetDocumentRequest';
import { GetDocumentFileRequest } from 'src/app/shared/models/document/request/GetDocumentFileRequest';
import { DownloadFileRequest } from 'src/app/shared/models/document/request/DownloadFileRequest';
import { DeleteDucumentRequest } from 'src/app/shared/models/document/request/DeleteDucumentRequest';

const endpoint = environment.services.document.endpoint;

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  addDocument(body: AddDocumentRequest):Observable<any>{
    let url = endpoint.addDocument;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("service addDocument success"))
    )
  }


  getDocument(body: GetDocumentRequest):Observable<any>{
    let url = endpoint.getDocument;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("service getDocument success"))
    )
  }

  getProcess(body: number):Observable<any>{
    let url = endpoint.getProcess;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("service getProcess success"))
    )
  }

  getDocumentFile(body: GetDocumentFileRequest):Observable<any>{
    let url = endpoint.getDocumentFile;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("service getDocumentFile success"))
    )
  }

  downloadtFile(body: DownloadFileRequest):Observable<any>{
    let url = endpoint.downloadFile;
 
    return this.http.post(url,body,{
      responseType:'blob' 
    
    }).pipe(
      tap(_=> console.log("service downloadtFile success"))
    )
  }

  deleteDocumentFile(body: DeleteDucumentRequest):Observable<any>{
    let url = endpoint.deleteDocumentFile;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("service deleteDocumentFile success"))
    )
  }
}
