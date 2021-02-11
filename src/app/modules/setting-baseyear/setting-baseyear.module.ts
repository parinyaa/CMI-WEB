import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingBaseyearRoutingModule } from './setting-baseyear-routing.module';
import { SettingBaseyearComponent } from './setting-baseyear.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [SettingBaseyearComponent],
  imports: [
    CommonModule,
    SettingBaseyearRoutingModule,
    SharedModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
  ]
})
export class SettingBaseyearModule { }
