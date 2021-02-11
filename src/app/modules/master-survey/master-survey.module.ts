import { ContactService } from './../../core/service/contact/contact.service';
import { ProvinceService } from './../../core/service/province/province.service';
import { ParamService } from './../../core/service/param/param.service';
import { DataconfigService } from './../../core/service/dataconfig/dataconfig.service';
import { DataConfigCreateRequest } from './../../shared/models/dataconfig/DataConfigCreateRequest';
import { DataConfigListRequest } from './../../shared/models/dataconfig/DataConfigListRequest';
import { SourceEditRequest } from './../../shared/models/source/request/sourceeditrequest';
import { SourceCreateRequest } from './../../shared/models/source/request/sourceCreateRequest';
import { SourceCreateDefaultRequest } from './../../shared/models/source/request/sourceCreateDefaultRequest';
import { SurveyEditRequest } from './../../shared/models/survey/request/surveyEditRequest';
import { tambolSearchPostCodeRequest } from './../../shared/models/tambol/request/tambolSearchPostCodeRequest';
import { Pageable } from './../../shared/models/survey/request/pageable';
import { SurveyPageableRequest } from './../../shared/models/survey/request/surveypageablerequest';
import { ContactAddRequest } from './../../shared/models/contact/request/contactaddrequest';
import { MatTableModule } from '@angular/material';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MasterSourceModule } from './../master-source/master-source.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterSurveyRoutingModule } from './master-survey-routing.module';
import { SurveyComponent } from './page/survey.component';
import { MaterialModule } from 'src/app/material.module';
import { DialogSurveyComponent } from './component/dialog-survey/dialog-survey.component';
import { TambolSearchRequest } from 'src/app/shared/models/request/tambolsearchRequest';
import { TambolserviceService } from 'src/app/core/service/tambol/tambolservice.service';
import { SurveyAddRequest } from 'src/app/shared/models/survey/request/surveyaddrequest';
import { SortedList } from 'src/app/shared/models/survey/request/sortedList';
import { SourceService } from 'src/app/core/service/source/source.service';
import { SourcePageableRequest } from 'src/app/shared/models/source/request/sourcepageablerequest';
import { DataConfigComponent } from './component/data-config/data-config.component';

@NgModule({
  declarations: [SurveyComponent, DialogSurveyComponent, DataConfigComponent],
  imports: [
    CommonModule,
    MasterSurveyRoutingModule,
    MaterialModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MasterSourceModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  providers:[
    TambolSearchRequest,
    TambolserviceService,
    SurveyAddRequest,
    ContactAddRequest,
    SurveyPageableRequest,
    Pageable,
    SortedList,
    tambolSearchPostCodeRequest,
    SurveyEditRequest,
    SourceCreateDefaultRequest,
    SourceService,
    SourceCreateRequest,
    SourcePageableRequest,
    SourceEditRequest,
    DataConfigListRequest,
    DataConfigCreateRequest,
    DataconfigService,
    ParamService,
    ProvinceService,
    ContactService
  ],
  entryComponents: [DialogSurveyComponent]
})
export class MasterSurveyModule { }
