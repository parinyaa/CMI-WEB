import { ParamGroupCreateRequest } from './../../shared/models/param/request/ParamGroupCreateRequest';
import { ParamInfoEditRequest } from './../../shared/models/param/request/ParamInfoEditRequest';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterParamsRoutingModule } from './master-params-routing.module';
import { MasterParamsComponent } from './master-params.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogAddparamsgroupComponent } from './component/dialog-addparamsgroup/dialog-addparamsgroup.component';
import { MasterParaminfoComponent } from './component/master-paraminfo/master-paraminfo.component';
import { DialogAddparaminfoComponent } from './component/dialog-addparaminfo/dialog-addparaminfo.component';
import { DialogEditparaminfoComponent } from './component/dialog-editparaminfo/dialog-editparaminfo.component';
import { DialogEditparamgroupComponent } from './component/dialog-editparamgroup/dialog-editparamgroup.component';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamInfoCreateRequest } from 'src/app/shared/models/param/request/ParamInfoCreateRequest';
import { ParamGroupEditRequest } from 'src/app/shared/models/param/request/ParamGroupEditRequest';


@NgModule({
  declarations: [MasterParamsComponent, DialogAddparamsgroupComponent, MasterParaminfoComponent,DialogAddparaminfoComponent, DialogEditparaminfoComponent, DialogEditparamgroupComponent],
  imports: [
    CommonModule,
    MasterParamsRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  }),
  FormsModule
  ],
  entryComponents:[DialogAddparamsgroupComponent,DialogAddparaminfoComponent,DialogEditparaminfoComponent,
    DialogEditparamgroupComponent],
  providers:[
    ParamService,
    ParamInfoCreateRequest,
    ParamInfoEditRequest,
    ParamGroupCreateRequest,
    ParamGroupEditRequest,
  ]
})
export class MasterParamsModule { }
