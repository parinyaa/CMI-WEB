import { StakeholderEditRequest } from './../../shared/models/stakeholder/request/stakeholderEditRequest';
import { StakeholderAddRequest } from './../../shared/models/stakeholder/request/stakeholderaddrequest';
import { ProvinceService } from './../../core/service/province/province.service';
import { TambolserviceService } from './../../core/service/tambol/tambolservice.service';
import { TambolSearchRequest } from './../../shared/models/request/tambolsearchRequest';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tambolSearchPostCodeRequest } from './../../shared/models/tambol/request/tambolSearchPostCodeRequest';
import { MasterStakeholderRoutingModule } from './master-stakeholder-routing.module';
import { StakeholderComponent } from './page/stakeholder.component';
import { MaterialModule } from 'src/app/material.module';
import { DialogStakeholderComponent } from './component/dialog-stakeholder/dialog-stakeholder.component';
import { StakeholderService } from 'src/app/core/service/stakeholder/stakeholder.service';
import { StakeholderPageableRequest } from 'src/app/shared/models/stakeholder/request/stakeholderpageablerequest';
import { Pageable } from 'src/app/shared/models/stakeholder/request/pageable';
import { SortedList } from 'src/app/shared/models/stakeholder/request/sortedList';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatTableModule } from '@angular/material';
import { DetailStakeholderComponent } from './component/detail-stakeholder/detail-stakeholder.component';


@NgModule({
  declarations: [StakeholderComponent, DialogStakeholderComponent, DetailStakeholderComponent],
  imports: [
    CommonModule,
    MasterStakeholderRoutingModule,
    MatTableModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  providers: [
    StakeholderService,
    StakeholderPageableRequest,
    Pageable,
    SortedList,
    TambolSearchRequest,
    TambolserviceService,
    ProvinceService,
    tambolSearchPostCodeRequest,
    StakeholderAddRequest,
    TambolSearchRequest,
    TambolserviceService,
    StakeholderEditRequest,
  ],
  entryComponents: [
    DialogStakeholderComponent,
    DetailStakeholderComponent
  ]
})
export class MasterStakeholderModule { }
