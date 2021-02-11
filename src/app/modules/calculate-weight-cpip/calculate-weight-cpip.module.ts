import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculateWeightCpipRoutingModule } from './calculate-weight-cpip-routing.module';
import { AddAdjustPweightDialogComponent } from './components/add-adjust-pweight-dialog/add-adjust-pweight-dialog.component';
import { AddMoveWeightDialogComponent } from './components/add-move-weight-dialog/add-move-weight-dialog.component';
import { AddMoveWeightthreeDialogComponent } from './components/add-move-weightthree-dialog/add-move-weightthree-dialog.component';
import { AddMoveWeighttwoDialogComponent } from './components/add-move-weighttwo-dialog/add-move-weighttwo-dialog.component';
import { HistoryStepComponent } from './components/history-step/history-step.component';
import { HistoryWeightComponent } from './components/history-weight/history-weight.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ViewDeleteComponent } from './components/view-delete/view-delete.component';
import { WeightCancelStepComponent } from './components/weight-cancel-step/weight-cancel-step.component';
import { WeightStep2ComponentComponent } from './components/weight-step2-component/weight-step2-component.component';
import { WeightStep3ComponentComponent } from './components/weight-step3-component/weight-step3-component.component';
import { WeightPageComponent } from './components/weight-page/weight-page.component';
import { WeightStep1ComponentComponent } from './components/weight-step1-component/weight-step1-component.component';
import { MaterialModule } from 'src/app/material.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogDeleteWeightDataComponent } from './components/dialog-delete-weight-data/dialog-delete-weight-data.component';
import { WeightCancelStepComponentsComponent } from './components/weight-cancel-step-components/weight-cancel-step-components.component';
import { DialogCancelWeightStepComponent } from './components/dialog-cancel-weight-step/dialog-cancel-weight-step.component';
import { WeightStep4ComponentComponent } from './components/weight-step4-component/weight-step4-component.component';
import { DialogMappingWeightComponent } from './components/dialog-mapping-weight/dialog-mapping-weight.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogCompareWeightComponent } from './components/dialog-compare-weight/dialog-compare-weight.component';


@NgModule({
  declarations: [AddAdjustPweightDialogComponent, 
    AddMoveWeightDialogComponent, 
    AddMoveWeightthreeDialogComponent, 
    AddMoveWeighttwoDialogComponent, 
    HistoryStepComponent, HistoryWeightComponent, 
    UploadFileComponent, 
    ViewDeleteComponent, 
    WeightCancelStepComponent, 
    WeightStep2ComponentComponent, 
    WeightStep3ComponentComponent, 
    WeightPageComponent, 
    WeightStep1ComponentComponent, 
    DialogDeleteWeightDataComponent, 
    WeightCancelStepComponentsComponent, 
    DialogCancelWeightStepComponent, 
    WeightStep4ComponentComponent, 
    DialogMappingWeightComponent, DialogCompareWeightComponent
    ],
  imports: [
    CommonModule,
    CalculateWeightCpipRoutingModule,
    MaterialModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  entryComponents: [AddAdjustPweightDialogComponent, 
    ViewDeleteComponent, 
    AddMoveWeighttwoDialogComponent,
    AddMoveWeightthreeDialogComponent,
    AddMoveWeightDialogComponent,
    HistoryWeightComponent,
    HistoryStepComponent,
    DialogDeleteWeightDataComponent,
    DialogCancelWeightStepComponent,
    DialogMappingWeightComponent,
    DialogCompareWeightComponent
  ],
})
export class CalculateWeightCpipModule { }
