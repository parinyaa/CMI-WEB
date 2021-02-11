import { CalendarService } from 'src/app/core/service/calendar/calendar.service';
import { ParamService } from './../../core/service/param/param.service';
import { GetDataSetRequest } from './../../shared/models/dataenty/request/GetDataSetRequest';
import { MaterialModule } from './../../material.module';
import { DataEntyService } from './../../core/service/dataenty/dataenty.service';
import { GetMatrixRequest } from './../../shared/models/dataenty/request/GetMatrixRequest';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataentyRoutingModule } from './dataenty-routing.module';
import { DataentyComponent } from './dataenty.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { KeyinDataModule } from '../keyin-data/keyin-data.module';
import { KeyinDailyModule } from '../keyin-daily/keyin-daily.module';
import { WorkflowModule } from '../workflow/workflow.module';


@NgModule({
  declarations: [
    DataentyComponent
  ],
  imports: [
    CommonModule,
    DataentyRoutingModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    KeyinDataModule,
    KeyinDailyModule,
    WorkflowModule
  ],
  providers: [
    GetMatrixRequest,
    DataEntyService,
    GetDataSetRequest,
    ParamService,
    CalendarService
  ]
})
export class DataentyModule { }
