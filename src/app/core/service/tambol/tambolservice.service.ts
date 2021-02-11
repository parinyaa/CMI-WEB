import { tambolSearchPostCodeRequest } from './../../../shared/models/tambol/request/tambolSearchPostCodeRequest';
import { TambolSearchRequest } from './../../../shared/models/request/tambolsearchRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TambolAddRequest } from 'src/app/shared/models/tambol/request/tambolAddRequst';
import { TambolEditRequest } from 'src/app/shared/models/tambol/request/tambolEditRequest';
const endpoint = environment.services.region.endpoint.tambol;
const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  }),
};
@Injectable({
  providedIn: 'root'
})
export class TambolserviceService {

  constructor(
    private http:HttpClient
  ) { }

  createTambol(body:TambolAddRequest):Observable<any>{
    let url = endpoint.tambol;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("Service createTambol Success"))
    );
  }

  editTambol(body:TambolEditRequest):Observable<any>{
    let url = endpoint.tambol;
    return this.http.put(url,body,httpOptions).pipe(
      tap(_=> console.log("Service createTambol Success"))
    );
  }

  deleteTambol(tambolCode:string,amphurId : number):Observable<any>{
    let url = endpoint.tambol;
    return this.http.request("delete",url, { body: { "tambolCode": tambolCode,"amphurId":amphurId } }).pipe(
      tap(_ => console.log('deleteTambol success'))
    );
  }

  getTambol(amphurId:number):Observable<any>{
    let url = endpoint.tambol+"/amphur/"+amphurId
    return this.http.get(url,httpOptions).pipe(
      tap(_=> console.log("Service getTambol Success"))
    );
  }

  searchTambol(req:TambolSearchRequest):Observable<any>{
    let url = endpoint.search;
    return this.http.post(url,req,httpOptions).pipe(
      tap(_=> console.log("Service SearchTambol Success"))
    );
  }

  getTambolById(tambolId:number):Observable<any>{
    let url = endpoint.tambol+"/"+tambolId;
    return this.http.get(url,httpOptions).pipe(
      tap(_=> console.log("Service getTambolById Success"))
    );
  }
  
  getAddressByPostCode(body:tambolSearchPostCodeRequest):Observable<any>{
    let url = endpoint.postcode;
    return this.http.post(url,body,httpOptions).pipe(
      tap(_=> console.log("Service getAddressByPostCode Success"))
    );
  }

}
