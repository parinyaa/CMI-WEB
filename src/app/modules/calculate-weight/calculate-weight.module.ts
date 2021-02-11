import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculateWeightRoutingModule } from './calculate-weight-routing.module';
import { CalculateWeightComponent } from './calculate-weight.component';
import { MaterialModule } from 'src/app/material.module';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { DialogTypeonecalComponent } from './components/dialog-typeonecal/dialog-typeonecal.component';
import { DialogTypesecondcalComponent } from './components/dialog-typesecondcal/dialog-typesecondcal.component';
import { DialogTypethirdcalComponent } from './components/dialog-typethirdcal/dialog-typethirdcal.component';
import { CalweightSuccessComponent } from './components/calweight-success/calweight-success.component';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { InsertWeightDataRequest } from 'src/app/shared/models/weight/request/InsertWeightDataRequest'
import { from } from 'rxjs';
import { DialogDeleteWeightDataComponent } from './components/dialog-delete-weight-data/dialog-delete-weight-data.component';
import { DeleteWeightDataRequest } from 'src/app/shared/models/weight/request/DeleteWeightDataRequest'
import { OtherActionWeightDataRequest } from 'src/app/shared/models/weight/request/OtherActionWeightDataRequest.model'
import { DialogCancelWeightStepComponent } from './components/dialog-cancel-weight-step/dialog-cancel-weight-step.component';
import { CancelWeightStepRequest } from 'src/app/shared/models/weight/request/CancelWeightStepRequest.model';
import { DialogHistoryWeightComponent } from './components/dialog-history-weight/dialog-history-weight.component';
import { DialogMappingWeightComponent } from './components/dialog-mapping-weight/dialog-mapping-weight.component';
import { CalculateWeightNextStepRequest } from 'src/app/shared/models/weight/request/CalculateWeightNextStepRequest.model';
import { MatDatepickerModule } from '@angular/material';
import { InsertAndUpdateMappingCPAWithWeightRequest } from 'src/app/shared/models/weight/request/InsertAndUpdateMappingCPAWithWeightRequest.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogViewCpaMappingComponent } from './components/dialog-view-cpa-mapping/dialog-view-cpa-mapping.component';

@NgModule({
  declarations: [
    CalculateWeightComponent,
    DialogTypeonecalComponent,
    DialogTypesecondcalComponent,
    DialogTypethirdcalComponent,
    CalweightSuccessComponent,
    DialogDeleteWeightDataComponent,
    DialogCancelWeightStepComponent,
    DialogHistoryWeightComponent,
    DialogMappingWeightComponent,
    DialogViewCpaMappingComponent,
  ],
  imports: [
    CommonModule,
    CalculateWeightRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    AngularFileUploaderModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn',
    }),
    SharedModule
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
    InsertAndUpdateMappingCPAWithWeightRequest
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
export class CalculateWeightModule { }
