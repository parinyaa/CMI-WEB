import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterCommoditycalRoutingModule } from './master-commoditycal-routing.module';
import { MasterCommoditycalComponent } from './master-commoditycal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogAddcommoditycalComponent } from './components/dialog-addcommoditycal/dialog-addcommoditycal.component';
import { DialogEditcommoditycalComponent } from './components/dialog-editcommoditycal/dialog-editcommoditycal.component';


@NgModule({
  declarations: [MasterCommoditycalComponent, DialogAddcommoditycalComponent, DialogEditcommoditycalComponent],
  imports: [
    CommonModule,
    MasterCommoditycalRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  entryComponents: [DialogAddcommoditycalComponent,DialogEditcommoditycalComponent]
})
export class MasterCommoditycalModule { }
