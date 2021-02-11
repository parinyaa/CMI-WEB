import { ErrorInterceptor } from './core/service/Interceptor/ErrorInterceptor';
import { CoreModule } from './core/core.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeModule } from './modules/home/home.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { noWhitespaceValidator } from './shared/common/noWhitespaceValidator';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material';
import { JwtInterceptorService } from './core/service/user/jwt-interceptor.service';
import {DataentyModule} from './modules/dataenty/dataenty.module';
import {CommodityValidateModule} from './modules/commodity-validate/commodity-validate.module';
import {CalculateIndexWeightModule} from './modules/commodity-validate/calculate-index-weight/calculate-index-weight.module';
import {ResultCommodityModule} from './modules/result-commodity/result-commodity.module';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HomeModule,
    MaterialModule,
    NgxSpinnerModule,
    CoreModule,
    DataentyModule,
    CommodityValidateModule,
    CalculateIndexWeightModule,
    ResultCommodityModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor , multi: true },
    noWhitespaceValidator,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance},


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
