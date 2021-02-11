import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InquireRegionStep, UpdateRegionProportionRequest, CallStageRequest } from 'src/app/shared/models/createBaseYear/InquireRegionStep';

const endpoint = environment.services.rebase.endpoint;
const regionStep = environment.services.regionStep.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class RegionStepService {

  constructor(
    private http: HttpClient
  ) { }


  getRegionStep(body: InquireRegionStep): Observable<any> {
    let url = endpoint.getRegionStep;
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("getRegionStep Success"))
    )
  }

  updateRegionStep(body: UpdateRegionProportionRequest): Observable<any> {
    let url = endpoint.updateRegionStep;
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("updateRegionStep Success"))
    )
  }

  nextStage(body: CallStageRequest): Observable<any> {
    let url = regionStep.nextStage
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("nextStage Success"))
    )
  }

  currentStage(body: CallStageRequest): Observable<any> {
    let url = regionStep.currentStage
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("currentStage Success"))
    )
  }


}
