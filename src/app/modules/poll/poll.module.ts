import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendPollAnswerPageComponent } from './components/send-poll-answer-page/send-poll-answer-page.component';
import { PollRoutingModule } from './poll-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { InsertPollDataRequest } from 'src/app/shared/models/poll/InsertPollDataRequest.model';



@NgModule({
  declarations: [SendPollAnswerPageComponent],
  imports: [
    CommonModule,
    PollRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    })
  ],
  providers: [
    QuestionnaireService,
    InsertPollDataRequest
  ]
})
export class PollModule { }
