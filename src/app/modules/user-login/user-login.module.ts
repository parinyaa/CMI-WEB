import { SessionServiceService } from './../../core/service/common/session-service.service';
import { RouterEvent } from '@angular/router';
import { AuthRequest } from './../../shared/models/request/auth-request';
import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { UserLoginRoutingModule } from './user-login-routing.module';
import { UserLoginComponent } from './user-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthserviceService } from 'src/app/core/service/user/authservice.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from 'src/app/core/service/user/jwt-interceptor.service';


@NgModule({
  declarations: [UserLoginComponent],
  imports: [
    CommonModule,
    UserLoginRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers:[
    AuthRequest,
    AuthserviceService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    SessionServiceService
  ]
})
export class UserLoginModule { }
