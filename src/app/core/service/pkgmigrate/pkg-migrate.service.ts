import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { migrateDataRequest } from 'src/app/shared/models/pkgmigrate/migrateDataRequest';

const endpoint = environment.services.pkgMigrate.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class PkgMigrateService {

  constructor(
    private http: HttpClient
  ) { }
  getYearMonth(): Observable<any>{
    const url = endpoint + '/getYearMonth';
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log('getYearMonth success'))
    );
  }

  migrateData(body: migrateDataRequest): Observable<any> {
    let url = endpoint + '/migrate';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("migrateData Success"))
    )
  }

  confirmMigrate(body: migrateDataRequest): Observable<any> {
    let url = endpoint + '/confirmMigrate';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("confirmMigrate Success"))
    )
  }

}
