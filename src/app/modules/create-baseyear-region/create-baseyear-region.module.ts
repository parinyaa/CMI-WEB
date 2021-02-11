import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateBaseyearRegionRoutingModule } from './create-baseyear-region-routing.module';
import { CreateBaseyearRegionComponent } from './create-baseyear-region.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { StepPageComponent } from './component/step-page/step-page.component';
import { StageFirstComponent } from './component/stage-first/stage-first.component';
import { StageSecondComponent } from './component/stage-second/stage-second.component';
import { StageThirdComponent } from './component/stage-third/stage-third.component';
import { StageFouthComponent } from './component/stage-fouth/stage-fouth.component';
import { StageFifthComponent } from './component/stage-fifth/stage-fifth.component';
import { CreateInfoBaseyearModule } from '../create-info-baseyear/create-info-baseyear.module';


@NgModule({
  declarations: [CreateBaseyearRegionComponent, StepPageComponent, StageFirstComponent, StageSecondComponent, StageThirdComponent, StageFouthComponent, StageFifthComponent],
  imports: [
    CommonModule,
    CreateBaseyearRegionRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    CreateInfoBaseyearModule
  ]
})
export class CreateBaseyearRegionModule { }
