import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeightMappingRoutingModule } from './weight-mapping-routing.module';
import { WeightMappingComponent } from './weight-mapping.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogSettingMappingComponent } from './component/dialog-setting-mapping/dialog-setting-mapping.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [WeightMappingComponent, DialogSettingMappingComponent],
  imports: [
    CommonModule,
    WeightMappingRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn',
      confirmButtonText:'ตกลง',
      cancelButtonText:'ยกเลิก'
  }),
  ],
  entryComponents: [DialogSettingMappingComponent]
})
export class WeightMappingModule { }
