import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultCommodityRoutingModule } from './result-commodity-routing.module';
import { ResultCommodityPageComponent } from './components/result-commodity-page/result-commodity-page.component';
import { CommodityService } from 'src/app/core/service/commodity/commodity.service';
import { InquiryResultCommodityRequest } from 'src/app/shared/models/result-commodity/request/InquiryResultCommodityRequest.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BaseyearService } from 'src/app/core/service/baseyear/baseyear.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ResultWeightPageComponent } from './components/result-weight-page/result-weight-page.component';
import { ResultIndexPageComponent } from './components/result-index-page/result-index-page.component';
import { ResultSopWeightPageComponent } from './components/result-sop-weight-page/result-sop-weight-page.component';
import { ResultSopIndexPageComponent } from './components/result-sop-index-page/result-sop-index-page.component';
import { DialogExportResultCommodityComponent } from './components/dialog-export-result-commodity/dialog-export-result-commodity.component';
import {DatePipe} from '@angular/common';


@NgModule({
  declarations: [ResultCommodityPageComponent, ResultWeightPageComponent, ResultIndexPageComponent, ResultSopWeightPageComponent, ResultSopIndexPageComponent, DialogExportResultCommodityComponent],
  imports: [
    CommonModule,
    FormsModule,
    ResultCommodityRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    })
  ],
  entryComponents:[DialogExportResultCommodityComponent],
  providers: [
    CommodityService,
    BaseyearService,
    ParamService,
    InquiryResultCommodityRequest,
    DatePipe
  ]
})
export class ResultCommodityModule { }
