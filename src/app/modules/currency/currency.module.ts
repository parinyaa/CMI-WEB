import { MatSortModule } from '@angular/material/sort';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyRoutingModule } from './currency-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CurrencyPageComponent } from './components/currency-page/currency-page.component';
import { MatDatepickerModule } from '@angular/material';
import { CommodityService } from 'src/app/core/service/commodity/commodity.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { CurrencyService } from 'src/app/core/service/currency/currency.service';
import { InsertCurrencyRequest } from 'src/app/shared/models/currency/request/InsertCurrencyRequest.model'


@NgModule({
  declarations: [CurrencyPageComponent],
  imports: [
    CommonModule,
    CurrencyRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    MatSortModule
  ],
  providers: [
    CommodityService,
    ParamService,
    CurrencyService,
    InsertCurrencyRequest
  ]
})
export class CurrencyModule { }
