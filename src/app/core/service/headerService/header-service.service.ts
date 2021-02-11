import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
const endpoint = environment.services.vparam.endpoint;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json;charset=UTF-8'
  })
};
@Injectable({
  providedIn: 'root'
})
export class HeaderServiceService {

  constructor( private http:HttpClient) { }

  getMenuObject():Observable<any>{
 
    var url = endpoint.getMenuObject;
    return this.http.get(url).pipe(
      tap(_ => console.log('success'))
    )
  }
}
