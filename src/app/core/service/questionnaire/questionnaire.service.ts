import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InsertVersionRequest } from 'src/app/shared/models/questionnaire/request/InsertVersionRequest';
import { UpdateVersionRequest } from 'src/app/shared/models/questionnaire/request/UpdateVersionRequest';
import { InsertQuestionRequest } from 'src/app/shared/models/questionnaire/request/InsertQuestionRequest';
import { UpdateQuestionRequest } from 'src/app/shared/models/questionnaire/request/UpdateQuestionRequest';
import { InsertAndUpdateAnswerRequest } from 'src/app/shared/models/questionnaire/request/InsertAndUpdateAnswerRequest';
import { InsertPollDataRequest } from 'src/app/shared/models/poll/InsertPollDataRequest.model';

const endpoint = environment.services.questionnaire.endpoint;
let httpOptions = {};

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  constructor(
    private http: HttpClient
  ) {
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8'
      })
    }
  }

  createVersion(body: InsertVersionRequest): Observable<any> {
    let url = endpoint + '/version/insert';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("createVersion Success"))
    )
  }

  getAllVersion(page: number, size: number): Observable<any> {
    let url = endpoint + '/version/getall' + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getAllVersion Success"))
    )
  }

  getVersionById(id: any): Observable<any> {
    let url = endpoint + '/version/get/' + id;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getVersionById Success"))
    )
  }

  updateVersion(body: UpdateVersionRequest): Observable<any> {
    let url = endpoint + '/version/edit';
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log("updateVersion Success"))
    )
  }

  createQuestion(body: InsertQuestionRequest): Observable<any> {
    let url = endpoint + '/question/insert';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("createVersion Success"))
    )
  }

  createAndUpdateAnswer(body: InsertAndUpdateAnswerRequest): Observable<any> {
    let url = endpoint + '/answer/insert';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("createAndUpdateAnswer Success"))
    )
  }

  createPollData(body: InsertPollDataRequest): Observable<any> {
    let url = endpoint + '/data/insert';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("createPollData Success"))
    )
  }

  getQuestionByVersionId(id, page: number, size: number): Observable<any> {
    let url = endpoint + '/question/getbyversion/' + id + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getQuestionByVersionId Success"))
    )
  }

  updateQuestion(body: UpdateQuestionRequest): Observable<any> {
    let url = endpoint + '/question/edit';
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log("updateVersion Success"))
    )
  }

  deleteVersion(id): Observable<any> {
    let url = endpoint + '/version/delete/' + id;
    return this.http.delete(url, httpOptions).pipe(
      tap(_ => console.log("deleteVersion Success"))
    )
  }

  deleteQuestion(id): Observable<any> {
    let url = endpoint + '/question/delete/' + id;
    return this.http.delete(url, httpOptions).pipe(
      tap(_ => console.log("deleteQuestion Success"))
    )
  }

  getAnswerByQuestionId(id): Observable<any> {
    let url = endpoint + '/answer/getbyquestion/' + id;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getAnswerByQuestionId Success"))
    )
  }

  getQuestionWithAnswerByVersionId(id): Observable<any> {
    let url = endpoint + '/question/getanswer/' + id;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getQuestionWithAnswerByVersionId Success"))
    )
  }

  getResultPollDataByVersionId(id): Observable<any> {
    let url = endpoint + '/data/result/' + id;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getResultPollDataByVersionId Success"))
    )
  }

  getPollDataByAnswerId(id, page: number, size: number): Observable<any> {
    let url = endpoint + '/data/by/answer/' + id + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("getPollDataByAnswerId Success"))
    )
  }

}
