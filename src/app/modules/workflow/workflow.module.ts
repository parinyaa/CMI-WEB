import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './component/workflow.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { InboxComponentComponent } from './component/inbox-component/inbox-component.component';
import { DialogCreateInboxComponent } from './component/dialog-create-inbox/dialog-create-inbox.component';
import { DialogEditInboxComponent } from './component/dialog-edit-inbox/dialog-edit-inbox.component';
import { DialogMakeDicisionComponent } from './component/dialog-make-dicision/dialog-make-dicision.component';
import { MatDatepickerModule } from '@angular/material';
import { ParamService } from 'src/app/core/service/param/param.service';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';
import { CalendarService } from 'src/app/core/service/calendar/calendar.service';
import { InsertWorkflowRequest } from 'src/app/shared/models/workflow/request/InsertWorkflowRequest.model';
import { EditWorkFlowRequest } from 'src/app/shared/models/workflow/request/EditWorkFlowRequest.model';
import { DecisonComponentComponent } from './component/decison-component/decison-component.component';
import { MakeDecisionRequest } from 'src/app/shared/models/workflow/request/MakeDecisionRequest.model';
import { DialogResultDecisonComponent } from './component/dialog-result-decison/dialog-result-decison.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExtendedPeriodComponentComponent } from './component/extended-period-component/extended-period-component.component';
import { ReviewRelativeComponentComponent } from './component/review-relative-component/review-relative-component.component';
import { ReviewPriceComponentComponent } from './component/review-price-component/review-price-component.component';
import { SessionServiceService } from 'src/app/core/service/common/session-service.service';
import { InquiryWorkflowRequest } from 'src/app/shared/models/workflow/request/InquiryWorkflowRequest.model';

@NgModule({
  declarations: [
    WorkflowComponent,
    InboxComponentComponent,
    DialogCreateInboxComponent,
    DialogEditInboxComponent,
    DialogMakeDicisionComponent,
    DecisonComponentComponent,
    DialogResultDecisonComponent,
    ExtendedPeriodComponentComponent,
    ReviewRelativeComponentComponent,
    ReviewPriceComponentComponent
  ],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    FormsModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    SharedModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: LOCALE_ID, useValue: "th-TH" },
    ParamService,
    InputUtils,
    CalendarService,
    InsertWorkflowRequest,
    EditWorkFlowRequest,
    MakeDecisionRequest,
    SessionServiceService,
    InquiryWorkflowRequest
  ],
  entryComponents: [
    DialogCreateInboxComponent,
    DialogEditInboxComponent,
    DialogMakeDicisionComponent,
    DialogResultDecisonComponent
  ]
})
export class WorkflowModule { }
