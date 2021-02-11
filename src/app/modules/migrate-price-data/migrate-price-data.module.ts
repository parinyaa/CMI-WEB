import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MigratePriceDataRoutingModule } from './migrate-price-data-routing.module';
import { MigratePriceDataComponent } from './migrate-price-data.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [MigratePriceDataComponent],
  imports: [
    CommonModule,
    MigratePriceDataRoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
  ]
})
export class MigratePriceDataModule { }
