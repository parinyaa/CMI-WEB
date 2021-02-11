import { refreshToken } from './service/user/model/refreshToken';
import { MaterialModule } from './../material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FooterComponent } from './footer/footer.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [
    HeaderComponent,
    AppLayoutComponent,
    FooterComponent,
    LoginLayoutComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    NgxSpinnerModule,
    MaterialModule,
    SweetAlert2Module
  ],
  providers:[
    refreshToken,
  ]
})
export class CoreModule { }
