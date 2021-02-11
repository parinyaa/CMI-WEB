import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeightRoutingModule } from './weight-routing.module';
import { WeightPageComponent } from './components/weight-page/weight-page.component';
import { WeightStep1ComponentComponent } from './components/weight-step1-component/weight-step1-component.component';
import { WeightStep2ComponentComponent } from './components/weight-step2-component/weight-step2-component.component';
import { WeightStep3ComponentComponent } from './components/weight-step3-component/weight-step3-component.component';
import { DialogTypeonecalComponent } from './components/dialog-typeonecal/dialog-typeonecal.component';
import { DialogTypesecondcalComponent } from './components/dialog-typesecondcal/dialog-typesecondcal.component';
import { DialogTypethirdcalComponent } from './components/dialog-typethirdcal/dialog-typethirdcal.component';
import { DialogDeleteWeightDataComponent } from './components/dialog-delete-weight-data/dialog-delete-weight-data.component';
import { DialogCancelWeightStepComponent } from './components/dialog-cancel-weight-step/dialog-cancel-weight-step.component';
import { DialogHistoryWeightComponent } from './components/dialog-history-weight/dialog-history-weight.component';
import { DialogMappingWeightComponent } from './components/dialog-mapping-weight/dialog-mapping-weight.component';
import { DialogViewCpaMappingComponent } from './components/dialog-view-cpa-mapping/dialog-view-cpa-mapping.component';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { InsertWeightDataRequest } from 'src/app/shared/models/weight/request/InsertWeightDataRequest';
import { DeleteWeightDataRequest } from 'src/app/shared/models/weight/request/DeleteWeightDataRequest';
import { OtherActionWeightDataRequest } from 'src/app/shared/models/weight/request/OtherActionWeightDataRequest.model';
import { CancelWeightStepRequest } from 'src/app/shared/models/weight/request/CancelWeightStepRequest.model';
import { CalculateWeightNextStepRequest } from 'src/app/shared/models/weight/request/CalculateWeightNextStepRequest.model';
import { MatDatepickerModule } from '@angular/material';
import { InsertAndUpdateMappingCPAWithWeightRequest } from 'src/app/shared/models/weight/request/InsertAndUpdateMappingCPAWithWeightRequest.model';
import { WeightCancelStepComponentsComponent } from './components/weight-cancel-step-components/weight-cancel-step-components.component';
import { InsertWeightCPARequest } from 'src/app/shared/models/weight/request/InsertWeightCPARequest.model';
import { WeightStep4ComponentComponent } from './components/weight-step4-component/weight-step4-component.component';



@NgModule({
  declarations: [
    WeightPageComponent,
    WeightStep1ComponentComponent,
    WeightStep2ComponentComponent,
    WeightStep3ComponentComponent,
    DialogTypeonecalComponent,
    DialogTypesecondcalComponent,
    DialogTypethirdcalComponent,
    DialogDeleteWeightDataComponent,
    DialogCancelWeightStepComponent,
    DialogHistoryWeightComponent,
    DialogMappingWeightComponent,
    DialogViewCpaMappingComponent,
    WeightCancelStepComponentsComponent,
    WeightStep4ComponentComponent,
  ],
  imports: [
    CommonModule,
    WeightRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    AngularFileUploaderModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn',
    }),
    SharedModule,
    FormsModule
  ],
  providers: [
    WeightService,
    InsertWeightDataRequest,
    DeleteWeightDataRequest,
    OtherActionWeightDataRequest,
    CancelWeightStepRequest,
    CalculateWeightNextStepRequest,
    MatDatepickerModule,
    { provide: LOCALE_ID, useValue: "th-TH" },
    InsertAndUpdateMappingCPAWithWeightRequest,
    InsertWeightCPARequest
  ],
  entryComponents: [
    DialogTypeonecalComponent,
    DialogTypesecondcalComponent,
    DialogTypethirdcalComponent,
    DialogDeleteWeightDataComponent,
    DialogCancelWeightStepComponent,
    DialogHistoryWeightComponent,
    DialogMappingWeightComponent,
    DialogViewCpaMappingComponent
  ]
})
export class WeightModule { }
