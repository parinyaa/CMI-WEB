import { DataConfigSearchRequest } from './../../shared/models/dataconfig/DataConfigSearchRequest';
import { DataMatrixCreateRequest, DataMatrixList } from './../../shared/models/datamatrix/DataMatrixCreateRequest';
import { ProvinceService } from './../../core/service/province/province.service';
import { DataconfigService } from './../../core/service/dataconfig/dataconfig.service';
import { DataConfigPageRequest } from './../../shared/models/dataconfig/DataConfigPageRequest';
import { SortedList } from 'src/app/shared/models/survey/request/sortedList';
import { Pageable } from './../../shared/models/survey/request/pageable';
import { DataMatrixPageableRequest } from './../../shared/models/datamatrix/DataMatrixPageableRequest';
import { DatamatrixService } from './../../core/service/datamatrix/datamatrix.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterSettingoperatorRoutingModule } from './master-settingoperator-routing.module';
import { MasterSettingoperatorComponent } from './master-settingoperator.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogAddoperatorComponent } from './components/dialog-addoperator/dialog-addoperator.component';
import { DialogEditoperatorComponent } from './components/dialog-editoperator/dialog-editoperator.component';


@NgModule({
  declarations: [MasterSettingoperatorComponent, DialogAddoperatorComponent, DialogEditoperatorComponent],
  imports: [
    CommonModule,
    MasterSettingoperatorRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  entryComponents:[
    DialogAddoperatorComponent,
    DialogEditoperatorComponent,
  ],
  providers:[
    DatamatrixService,
    DataMatrixPageableRequest,
    Pageable,
    SortedList,
    DataConfigPageRequest,
    DataconfigService,
    ProvinceService,
    DataMatrixCreateRequest,
    DataMatrixList,
    DataConfigSearchRequest
  ]
})
export class MasterSettingoperatorModule { }
