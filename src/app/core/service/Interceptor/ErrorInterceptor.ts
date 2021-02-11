import { refreshToken } from './../user/model/refreshToken';
import { AuthserviceService } from './../user/authservice.service';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { RefreshToken } from 'src/app/shared/models/authen/RefreshTokenModel';
import { title } from 'process';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    messageError = "เกิดข้อผิดพลาด";
    messageTitle = "กรุณาติดต่อผู้ดูแลระบบ";
    constructor(
        private authserviceService:AuthserviceService,
        private refreshToken:refreshToken
    ) { }
    intercept(request:HttpRequest<any>,next :HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log(err);            
            if (err.status === 401) {
                if(err.error.code === "E0199" ){ 
                    this.refreshToken.refreshToken = JSON.parse(sessionStorage.getItem('currentUser')).refreshToken;
                    this.authserviceService.refreshTokenAuth(this.refreshToken)
                    .subscribe(
                        (res) => {
                            location.reload(true);
                        }
                    ) 
                } 
                else{
                    // Swal.fire(" ( "+err.error.code+") "+err.error.messageTh,"",'error');
                    Swal.fire({
                        title:" ( "+err.error.code+") "+err.error.messageTh,
                        text:"",
                        type:'error',
                        confirmButtonText:'ตกลง'
                    })
                    return throwError(err.error.messageEn);
                }   
            }else  if(err.status === 400){
                if(err.error.code === "E0104" ){ 
                    this.authserviceService.logout();
                    location.reload(true);
                }
                
                console.log(err);
            }
            else if(err.status == 0){
                this.messageError = "ไม่สามารถเชื่อมต่อระบบได้";
                // Swal.fire(this.messageError,this.messageTitle,'error');
                Swal.fire({
                    title:this.messageError,
                    text:this.messageTitle,
                    type:'error',
                    confirmButtonText:'ตกลง'
                })
                return throwError(err);
            }
            else if( err.error.messageEn == undefined){
                // Swal.fire(this.messageError,err.error.message,'error');
                Swal.fire({
                    title:this.messageError,
                    text:err.error.message,
                    type:'error',
                    confirmButtonText:'ตกลง'
                })
                return throwError(err);
            }
            else if (err.error.status === 500){
                // Swal.fire(err.error.messageTh?err.error.messageTh:err.error.message,err.error.messageEn?err.error.messageEn:err.error.message,'error');
                Swal.fire({
                    title:err.error.messageTh?err.error.messageTh:err.error.message,
                    text:err.error.messageEn?err.error.messageEn:err.error.message,
                    type:'error',
                    confirmButtonText:'ตกลง'
                })
                return throwError(err);
            }
            else{
                this.messageError = err.error.messageTh;
                this.messageTitle = err.error.messageEn;
                

                Swal.fire({
                    title:!this.messageError ?this.messageError : '',
                    text:this.messageTitle,
                    type:'error',
                    confirmButtonText:'ตกลง'
                })
                
                
                return throwError(err);
            }
            return throwError(err);
        }));
    }

}