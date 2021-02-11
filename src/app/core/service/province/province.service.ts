import {ProvinceEditRequest} from './../../../shared/models/request/provinceEditRequest';
import {ProvinceDeleteRequest} from './../../../shared/models/request/provinceDeleteRequest';
import {ProvinceAddRequst} from './../../../shared/models/request/provinceAddRequest';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Province} from '../../../shared/models/dataenty/request/Province';

const endpoint = environment.services.region.endpoint.province;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  constructor(private http: HttpClient) {}

  getProvinceByProvinceId(provinceId: number): Observable<any> {
    const url = endpoint.province + '/' + provinceId;
    return this.http
      .get(url, httpOptions)
      .pipe(tap((_) => console.log('getProvinceByProvinceId success')));
  }

  createProvince(req: ProvinceAddRequst): Observable<any> {
    const url = endpoint.province;
    return this.http
      .post(url, req, httpOptions)
      .pipe(tap((_) => console.log('createProvince success')));
  }

  deleteProvince(provinceCode: string): Observable<any> {
    const url = endpoint.province;
    return this.http
      .request('delete', url, {body: {provinceCode: provinceCode}})
      .pipe(tap((_) => console.log('deleteProvince success')));
  }

  updateProvince(request: ProvinceEditRequest): Observable<any> {
    const url = endpoint.province;
    return this.http
      .put(url, request, httpOptions)
      .pipe(tap((_) => console.log('updateProvince success')));
  }

  getProvinceAll(): Observable<any> {
    const url = endpoint.province;
    return this.http
      .get(url, httpOptions)
      .pipe(tap((_) => console.log('getProvinceAll success')));
  }
  getAllProvince(): Observable<any> {
    const url = endpoint.province;
    return this.http
      .get<any>(url, httpOptions)
      .pipe(tap((_) => console.log('getProvinceAll success')));
  }
}
