import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthserviceService } from './authservice.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService {

  constructor(
    private authenticationService:AuthserviceService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
 
   
    if (sessionStorage.getItem('currentUser')) {
     
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('currentUser')).accessToken}`
            }
            
        });
    }
    return next.handle(request);
}
}
 
