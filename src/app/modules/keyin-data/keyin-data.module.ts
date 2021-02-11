import { SharedModule } from 'src/app/shared/shared.module';
import { InputTypeNumber } from './../../core/utils/inputTypeNumber';
import { MonthlyDataList } from '../../shared/models/dataenty/request/MonthlyDataList';
import { MonthlyDataSaveRequest } from '../../shared/models/dataenty/request/MonthlyDataSaveRequest';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ParamService } from '../../core/service/param/param.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyinDataRoutingModule } from './keyin-data-routing.module';
import { KeyinPageComponent } from './page/keyin-page.component';
import { DataEntyService } from 'src/app/core/service/dataenty/dataenty.service';
import { DialogCommentComponent } from './component/dialog-comment/dialog-comment.component';
import { NeighborhoodDialogComponent } from './component/neighborhood-dialog/neighborhood-dialog.component';
import { PriceDataList } from '../../shared/models/dataenty/request/PricDataList';
import { PriceData } from '../../shared/models/dataenty/request/PriceData';
import { PricedataService } from '../../core/service/pricedata/pricedata.service';
import { DialogCheckpriceComponent } from './component/dialog-checkprice/dialog-checkprice.component';
import { AveragePercentageComponent } from './component/average-percentage/average-percentage.component';
import { CommemtSaveRequest } from '../../shared/models/datadaily/CommentSaveRequest';

@NgModule({
    declarations: [KeyinPageComponent, NeighborhoodDialogComponent,
        DialogCheckpriceComponent, AveragePercentageComponent, DialogCommentComponent],
    imports: [
        CommonModule,
        KeyinDataRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        SweetAlert2Module.forRoot({
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn'
        }),
        FormsModule,
        SharedModule
    ],
    providers: [
        DataEntyService,
        ParamService,
        MonthlyDataSaveRequest,
        CommemtSaveRequest,
        MonthlyDataList,
        PriceDataList,
        PriceData,
        PricedataService
    ],
    exports: [
        KeyinPageComponent
    ],
    entryComponents: [
        NeighborhoodDialogComponent,
        DialogCheckpriceComponent,
        DialogCommentComponent,
        AveragePercentageComponent
    ]
})
export class KeyinDataModule { }
