import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SyncBaseyearRoutingModule } from './sync-baseyear-routing.module';
import { SyncBaseyearComponent } from './sync-baseyear.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [SyncBaseyearComponent],
  imports: [
    CommonModule,
    SyncBaseyearRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SyncBaseyearModule { }
