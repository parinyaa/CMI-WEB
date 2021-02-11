import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { VersionQuestionPageComponent } from './components/version-question-page/version-question-page.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DialogAddVersionQuestionComponent } from './components/dialog-add-version-question/dialog-add-version-question.component';
import { MatDatepickerModule } from '@angular/material';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { InsertVersionRequest } from 'src/app/shared/models/questionnaire/request/InsertVersionRequest';
import { UpdateVersionRequest } from 'src/app/shared/models/questionnaire/request/UpdateVersionRequest';
import { DialogEditVersionQuestionComponent } from './components/dialog-edit-version-question/dialog-edit-version-question.component';
import { QustionPageComponent } from './components/qustion-page/qustion-page.component';
import { ParamService } from 'src/app/core/service/param/param.service';
import { DialogAddQuestionComponent } from './components/dialog-add-question/dialog-add-question.component';
import { InsertQuestionRequest } from 'src/app/shared/models/questionnaire/request/InsertQuestionRequest';
import { DialogEditQuestionComponent } from './components/dialog-edit-question/dialog-edit-question.component';
import { UpdateQuestionRequest } from 'src/app/shared/models/questionnaire/request/UpdateQuestionRequest';
import { DialogAnswerComponent } from './components/dialog-answer/dialog-answer.component';
import { InsertAndUpdateAnswerRequest } from 'src/app/shared/models/questionnaire/request/InsertAndUpdateAnswerRequest';
import { SubStringDescriptionPipe } from 'src/app/core/utils/stringUtils/sub-string-description.pipe';
import { ResultDataPageComponent } from './components/result-data-page/result-data-page.component';
import { NgxPrintModule } from 'ngx-print';
import { DialogRemarkPollDataComponent } from './components/dialog-remark-poll-data/dialog-remark-poll-data.component';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    VersionQuestionPageComponent,
    DialogAddVersionQuestionComponent,
    DialogEditVersionQuestionComponent,
    QustionPageComponent,
    DialogAddQuestionComponent,
    DialogEditQuestionComponent,
    DialogAnswerComponent,
    ResultDataPageComponent,
    DialogRemarkPollDataComponent
  ],
  imports: [
    CommonModule,
    QuestionnaireRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    NgxPrintModule,
    SharedModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: LOCALE_ID, useValue: "th-TH" },
    QuestionnaireService,
    InsertVersionRequest,
    UpdateVersionRequest,
    ParamService,
    InsertQuestionRequest,
    UpdateQuestionRequest,
    InsertAndUpdateAnswerRequest,
    InputUtils
  ],
  entryComponents: [
    DialogAddVersionQuestionComponent,
    DialogEditVersionQuestionComponent,
    DialogAddQuestionComponent,
    DialogEditQuestionComponent,
    DialogAnswerComponent,
    DialogRemarkPollDataComponent
  ]
})
export class QuestionnaireModule { }
