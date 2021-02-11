import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeyinDataweekRoutingModule } from './keyin-dataweek-routing.module';
import { KeyinDataweekComponent } from './keyin-dataweek.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [KeyinDataweekComponent],
  imports: [
    CommonModule,
    KeyinDataweekRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class KeyinDataweekModule { }
