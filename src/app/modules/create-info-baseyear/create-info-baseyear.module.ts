import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateInfoBaseyearRoutingModule } from './create-info-baseyear-routing.module';
import { CreateInfoBaseyearComponent } from './create-info-baseyear.component';
import { CalculatePtComponent } from './component/calculate-pt/calculate-pt.component';
import { DialogAddNewcommodityComponent } from './component/dialog-add-newcommodity/dialog-add-newcommodity.component';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ViewStageFirstComponent } from './component/view-stage-first/view-stage-first.component';
import { ViewStageSecondComponent } from './component/view-stage-second/view-stage-second.component';
import { ViewStageThirdComponent } from './component/view-stage-third/view-stage-third.component';
import { ViewStageFouthComponent } from './component/view-stage-fouth/view-stage-fouth.component';
import { ViewStageFifthComponent } from './component/view-stage-fifth/view-stage-fifth.component';
import { ViewStageSixthComponent } from './component/view-stage-sixth/view-stage-sixth.component';
import { ViewStageSeventhComponent } from './component/view-stage-seventh/view-stage-seventh.component';
import { ViewStageEightComponent } from './component/view-stage-eight/view-stage-eight.component';
import { ViewStageNineComponent } from './component/view-stage-nine/view-stage-nine.component';
import { ViewStageTenComponent } from './component/view-stage-ten/view-stage-ten.component';
import { ViewStageElevenComponent } from './component/view-stage-eleven/view-stage-eleven.component';
import { ViewStageTwelveComponent } from './component/view-stage-twelve/view-stage-twelve.component';
import { ViewStageThirteenComponent } from './component/view-stage-thirteen/view-stage-thirteen.component';
import { ViewStageFourteenComponent } from './component/view-stage-fourteen/view-stage-fourteen.component';
import { ViewStageFifteenComponent } from './component/view-stage-fifteen/view-stage-fifteen.component';
import { FilterDataComponent } from './component/filter-data/filter-data.component';
import { ViewStageThirdTwoComponent } from './component/view-stage-third-two/view-stage-third-two.component';


@NgModule({
  declarations: [CreateInfoBaseyearComponent, CalculatePtComponent, DialogAddNewcommodityComponent, ViewStageFirstComponent, ViewStageSecondComponent, ViewStageThirdComponent, ViewStageFouthComponent, ViewStageFifthComponent, ViewStageSixthComponent, ViewStageSeventhComponent, ViewStageEightComponent, ViewStageNineComponent, ViewStageTenComponent, ViewStageElevenComponent, ViewStageTwelveComponent, ViewStageThirteenComponent, ViewStageFourteenComponent, ViewStageFifteenComponent, FilterDataComponent, ViewStageThirdTwoComponent],
  imports: [
    CommonModule,
    CreateInfoBaseyearRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  }),
  ],
  entryComponents:[DialogAddNewcommodityComponent],
  providers:[
    ParamService
  ],
  exports: [FilterDataComponent]
})
export class CreateInfoBaseyearModule { }
