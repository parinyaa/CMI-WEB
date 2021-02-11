import { DataConfigCreateRequest } from './../../shared/models/dataconfig/DataConfigCreateRequest';
import { DataConfigListRequest } from './../../shared/models/dataconfig/DataConfigListRequest';
import { CpaPageableRequset } from './../../shared/models/ppitree/request/CpaPageableRequest';
import { PpitreeService } from './../../core/service/ppitree/ppitree.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterMappspecRoutingModule } from './master-mappspec-routing.module';
import { MasterMappspecComponent } from './master-mappspec.component';
import { MapspecComponent } from './components/mapspec/mapspec.component';


@NgModule({
  declarations: [MasterMappspecComponent, MapspecComponent],
  imports: [
    CommonModule,
    MasterMappspecRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  providers:[
    PpitreeService,
    CpaPageableRequset,
    DataConfigListRequest,
    DataConfigCreateRequest
  ]
})
export class MasterMappspecModule { }
