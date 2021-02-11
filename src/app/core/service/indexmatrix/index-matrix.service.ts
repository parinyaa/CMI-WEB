import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CpipMsIndexMatrixRequestForm } from 'src/app/shared/models/index-matrix/CpipMsIndexMatrixRequestForm';

const endpoint = environment.services.indexMatrix.endpoint.indexMatrix;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'

  }),
};
@Injectable({
  providedIn: 'root'
})
export class IndexMatrixService {

  constructor(
    private http: HttpClient
  ) { }
  inquiryIndexMatrix(paramInfo): Observable<any> {
    const url = `${endpoint}/inquiry/${paramInfo}`;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log('service inquiryIndexMatrix success'))
    );
  }

  getRegionOrProvinceByIndexMatrix(indexGroupId): Observable<any> {
    let url = endpoint + '/inquiry/param/' + indexGroupId;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getRegionOrProvinceByIndexMatrix Success"))
    )
  }

  getCpipMsIndexMatrixByIndexGroupId(indexGroupId, page: number, size: number): Observable<any> {
    let url = endpoint + '/inquiry/indexgroupid/' + indexGroupId + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getCpipMsIndexMatrixByIndexGroupId Success"))
    )
  }

  saveCpipMsIndexMatrix(body:CpipMsIndexMatrixRequestForm): Observable<any> {
    let url = endpoint + '/save';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("getCpipMsIndexMatrixByIndexGroupId Success"))
    )
  }

  deleteCpipMsIndexMatrix(body:CpipMsIndexMatrixRequestForm): Observable<any> {
    let url = endpoint + '/delete';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("deleteWeight Success"))
    )
  }
}
