import { tap } from 'rxjs/operators';
import { ContactDeletedRequest } from './../../../shared/models/contact/request/contactDeletedRequest';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const endpoint = environment.services.contact.endpoint.contact;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http:HttpClient
  ) { }

  deleteContact(body:ContactDeletedRequest):Observable<any>{
    let url = endpoint;
    return this.http.request("delete",url, { body: { "contactPersonId": body.contactPersonId } }).pipe(
      tap(_ => console.log('deleteContact success'))
    );
  }
}
