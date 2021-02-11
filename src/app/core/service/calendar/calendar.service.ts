import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {EachMonth} from 'src/app/shared/models/calendar/each-month';
import {GetCalendar} from 'src/app/shared/models/calendar/GetCalendar';

const endpoint = environment.services.calendar.endpoint.calendar;
let httpOptions = {};

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private http: HttpClient) {
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
      }),
    };
  }

  getAllCalendarInTheYear(yearId: string): Observable<any> {
    let url = endpoint + '/getAllCalendarInTheYear?yearId=' + yearId;
    return this.http
      .get(url, httpOptions)
      .pipe(tap((_) => console.log('getAllCalendarInTheYear Success')));
  }

  saveAllCalendar(yearId: string, calendarList: EachMonth[]) {
    let url = endpoint + '/saveAllCalendar?yearId=' + yearId;
    return this.http
      .post(url, calendarList, httpOptions)
      .pipe(tap((_) => console.log('saveAllCalendar Success')));
  }

  getCalendarCurrentmonth(): Observable<any> {
    let url = endpoint + '/getcurrentmonth';
    return this.http
      .get(url, httpOptions)
      .pipe(tap((_) => console.log('getCalendarCurrentmonth Success')));
  }

  inquireCurrentPeriod(): Observable<any> {
    let url = endpoint + '/getCurrentPeriod';
    return this.http
      .get(url, httpOptions)
      .pipe(tap((_) => console.log('inquireCurrentPeriod Success')));
  }

  getCalendar(request: GetCalendar): Observable<any> {
    let url = endpoint + '/getCalendar';
    return this.http
      .post(url, request, httpOptions)
      .pipe(tap((_) => console.log('getCalendar Success')));
  }

  checkCalendar(year: number): Observable<any> {
    let url = endpoint + '/checkCalendar/' + year;
    return this.http
      .get(url, httpOptions)
      .pipe(tap((_) => console.log('checkCalendar Success')));
  }

  initialCalendar(year: number): Observable<any> {
    let url = endpoint + '/initialCalendar/' + year;
    return this.http
      .get(url, httpOptions)
      .pipe(tap((_) => console.log('initialCalendar Success')));
  }

  yearDistinctInCalendar(): Observable<any> {
    let url = endpoint + '/yearDistinctInCalendar';
    return this.http
      .get(url, httpOptions)
      .pipe(tap((_) => console.log('yearDistinctInCalendar Success')));
  }
}
