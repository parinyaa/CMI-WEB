import { SharedModule } from 'src/app/shared/shared.module';
import { DataEntyService } from 'src/app/core/service/dataenty/dataenty.service';
import { KeyinDataModule } from './../keyin-data/keyin-data.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DailySaveRequest } from './../../shared/models/datadaily/DailySaveRequest';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ParamService } from './../../core/service/param/param.service';
import { GetDataDailyRequest } from './../../shared/models/datadaily/GetDataDailyRequest';
import { KeydailyService } from './../../core/service/keydaily/keydaily.service';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyinDailyRoutingModule } from './keyin-daily-routing.module';
import { KeyinDailyComponent } from './keyin-daily.component';
import { CdkTableModule } from '@angular/cdk/table';


@NgModule({
    declarations: [KeyinDailyComponent],
    imports: [
        CommonModule,
        KeyinDailyRoutingModule,
        MaterialModule,
        CdkTableModule,
        ReactiveFormsModule,
        FormsModule,
        SweetAlert2Module.forRoot({
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn'
        }),
        KeyinDataModule,
        SharedModule
    ],
    exports: [
        KeyinDailyComponent
    ],
    providers: [
        GetDataDailyRequest,
        KeydailyService,
        ParamService,
        DailySaveRequest,
        DataEntyService
    ]
})
export class KeyinDailyModule { }
