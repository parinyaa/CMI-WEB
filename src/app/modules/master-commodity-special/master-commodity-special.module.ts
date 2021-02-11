import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterCommoditySpecialRoutingModule } from './master-commodity-special-routing.module';
import { MasterCommoditySpecialComponent } from './master-commodity-special.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [MasterCommoditySpecialComponent],
  imports: [
    CommonModule,
    MasterCommoditySpecialRoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    SweetAlert2Module.forRoot(),
  ]
})
export class MasterCommoditySpecialModule { }
