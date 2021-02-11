import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CheckDataWeightRequest } from 'src/app/shared/models/weight/request/CheckDataWeightRequest.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InsertWeightDataRequest } from 'src/app/shared/models/weight/request/InsertWeightDataRequest';
import { RepDeletelistDataNotImportant } from 'src/app/shared/models/weight/request/RepDeletelistDataNotImportant.model';
import { RepWeightDataIdGive } from 'src/app/shared/models/weight/request/RepWeightDataIdGive.model';

import { ReqEditPweight } from 'src/app/shared/models/weight/request/ReqEditPweight.model';
import { ResponseApi } from 'src/app/shared/response';
import { InsertWeightDataCpipRequest } from 'src/app/shared/models/weight/request/InsertWeightDataRequest.model';
import { UpdateStepRequest } from 'src/app/shared/models/weight/request/UpdateStepRequest.model';
import { InquiryWeightDeleteRequest } from 'src/app/shared/models/weight/request/InquiryWeightDeleteRequest';
import { OtherActionWeightDataRequest } from 'src/app/shared/models/weight/request/OtherActionWeightDataRequest.model';
import { WeightCalculateRegionThailand } from 'src/app/shared/models/weight/request/WeightCalculateRegionThailand.model';
import { WeightMappingRequest } from 'src/app/shared/models/weight/request/WeightMappingRequest';
import { inquiryWeightDestination } from 'src/app/shared/models/weight/request/WeightMapping';

const endpoint = environment.services.weight.weightCalculate;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'

  }),
};
@Injectable({
  providedIn: 'root'
})
export class WeightCpipService {

  constructor(
    private http: HttpClient
  ) { }
  checkDataweight(params: CheckDataWeightRequest): Observable<any> {
    const url = `${endpoint}/checkDataweight`;
    return this.http.post(url, params, httpOptions).pipe(
      tap(_ => console.log('service checkDataweight success'))
    );
  }
  insertWeightData(req: InsertWeightDataCpipRequest): Observable<any> {
    const url = `${endpoint}/insert`;
    return this.http.post(url, req, httpOptions).pipe
      (tap(_ => console.log('weight success')));
  }
  getWeightDataByWeightId(id, step: number, weightCode: string, page: number, size: number): Observable<any> {
    let url = endpoint + '/getbybaseyear/' + id + '/step/' + step + '/' + weightCode + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightDataByBaseYear Success"))
    )
  }
  deleteWeight(id: number): Observable<any> {
    let url = endpoint + '/delete/' + id;
    return this.http.delete(url, httpOptions).pipe(
      tap(_ => console.log("deleteWeight Success"))
    )
  }
  getWeightDataByWeightIdStep3(id, filterWeightCode: string, page: number, size: number): Observable<any> {
    let url = endpoint + '/inquiryweightdatastep3/' + id + '/' + filterWeightCode + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightDataByBaseYear Success"))
    )
  }
  getWeightData(weightId: string): Observable<ResponseApi<any>> {
    const url = `${endpoint}/inquiryweightdata/${weightId}`;
    return this.http.get<ResponseApi<any[]>>(url, httpOptions).pipe(
      tap(_ => console.log('inquiry : weight'))
    );
  }
  getTypecode(weightId: string): Observable<ResponseApi<any>> {
    const url = `${endpoint}/gettypecode/${weightId}`;
    return this.http.get<ResponseApi<any[]>>(url, httpOptions).pipe
      (tap(_ => console.log('getTypecode : weightId')));
  }
  updateweight(request: ReqEditPweight): Observable<any> {
    const url = `${endpoint}/updateweight`;
    return this.http.post(url, request, httpOptions).pipe
      (tap(_ => console.log('END : updateweight'))
      );
  }
  getWeightId(weightId: string): Observable<ResponseApi<any>> {
    const url = `${endpoint}/inquiryweight/${weightId}`;
    return this.http.get<ResponseApi<any[]>>(url, httpOptions).pipe(
      tap(_ => console.log('inquiry : weightId'))
    );
  }
  inquiryDeleted(weightId: number, page: number, size: number): Observable<any> {
    const url = `${endpoint}/getbybaseyear/canceldeleted/${weightId}` + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log('inquiry : inquiryDeleted'))
    );
  }
  getDataNotImportant(weightId: string, coefficient: string): Observable<ResponseApi<any>> {
    const url = `${endpoint}/getdatanotimportant/${weightId}/${coefficient}`;
    return this.http.get<ResponseApi<any[]>>(url, httpOptions).pipe(
      tap(_ => console.log('inquiry : weightId'))
    );
  }
  DelDataNotImportant(Req: RepDeletelistDataNotImportant): Observable<any> {
    const url = `${endpoint}/delete`;
    return this.http.post(url, Req, httpOptions).pipe
      (tap(_ => console.log('inquiry : weightId')));
  }
  weightAction(request: OtherActionWeightDataRequest): Observable<any> {
    const url = `${endpoint}/data/action/included`;
    return this.http.post(url, request, httpOptions).pipe
      (tap(_ => console.log('weightAction success')));
  }
  inquiryWeightDelete(Req: InquiryWeightDeleteRequest): Observable<any> {
    const url = `${endpoint}/inquiryWeightDelete`;
    return this.http.post(url, Req, httpOptions).pipe
      (tap(_ => console.log('inquiry : inquiryWeightDelete')));
  }
  getWeightDataMove(weightId: string): Observable<ResponseApi<any>> {
    const url = `${endpoint}/inquiryweightdatamove/${weightId}`;
    return this.http.get<ResponseApi<any[]>>(url, httpOptions).pipe(
      tap(_ => console.log('inquiry : weight'))
    );
  }
  inquiryWeightDestination(request:inquiryWeightDestination, page: number, size: number): Observable<any> {
    const url = `${endpoint}/inquiryWeightDestination` + '?page=' + page + '&size=' + size;
    return this.http.post(url,request, httpOptions).pipe(
      tap(_ => console.log('inquiry : weight'))
    );
  }
  giveWeightDataId(req: RepWeightDataIdGive): Observable<any> {
    const url = `${endpoint}/giveweightdata`;
    return this.http.post(url, req, httpOptions).pipe
      (tap(_ => console.log('delete success')));
  }
  getHistory(weightDataId: string): Observable<ResponseApi<any>> {
    const url = `${endpoint}/gethistoryweight/${weightDataId}`;
    return this.http.get<ResponseApi<any[]>>(url, httpOptions).pipe(
      tap(_ => console.log('inquiry : weightId'))
    );
  }
  getStep(weightId: number, page: number, size: number): Observable<any> {
    const url = `${endpoint}/getstep/${weightId}` + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log('inquiry : getStep'))
    );
  }
  cancelStep(weightStepId: number): Observable<ResponseApi<any>> {
    const url = endpoint + '/deleteweightstep/' + weightStepId;
    return this.http.get<ResponseApi<any[]>>(url, httpOptions).pipe(
      tap(_ => console.log('inquiry : weightId'))
    );
  }
  getBackStep(weightId: string): Observable<ResponseApi<any>> {
    const url = `${endpoint}/backstep/${weightId}`;
    return this.http.get<ResponseApi<any[]>>(url, httpOptions).pipe(
      tap(_ => console.log('inquiry : weightId'))
    );
  }
  getWeightAndWeightDataByBaseYear(id: number, step: number): Observable<any> {
    let url = endpoint + '/getweightbybaseyear/' + id + '/step/' + step;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightAndWeightDataByBaseYear Success"))
    )
  }
  toNextStep(req: UpdateStepRequest): Observable<any> {
    const url = `${endpoint}/tonextstep`;
    return this.http.post(url, req, httpOptions).pipe
      (tap(_ => console.log('service toNextStep2 : weightId')));
  }
  autoMapping(req: WeightMappingRequest): Observable<any> {
    const url = `${endpoint}/auto-mapping`;
    return this.http.post(url, req, httpOptions).pipe
      (tap(_ => console.log('service autoMapping : weightId')));
  }
  toBackStep(req: UpdateStepRequest): Observable<any> {
    const url = `${endpoint}/tobackstep`;
    return this.http.post(url, req, httpOptions).pipe
      (tap(_ => console.log('service toBackStep2 : weightId')));
  }
  getWeightDataChildrenForMapping(id, page: number, size: number): Observable<any> {
    let url = endpoint + '/data/get/child/' + id + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getWeightDataChildrenForMapping Success"))
    )
  }
  calWeightThailand(req: WeightCalculateRegionThailand): Observable<any> {
    const url = `${endpoint}/calWeightThailand`;
    return this.http.post(url, req, httpOptions).pipe
      (tap(_ => console.log('calWeightThailand success')));
  }
  getCpip(id, page: number, size: number): Observable<any> {
    let url = endpoint + '/getcpip/' + id + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getCpip Success"))
    )
  }
}
