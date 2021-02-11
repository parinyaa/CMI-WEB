import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DATE_LOCALE,SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MaterialModule } from 'src/app/material.module';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './component/calendar.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
  


@NgModule({
  declarations: [CalendarComponent],
  imports: [
    SweetAlert2Module,
    FormsModule,
    CommonModule,
    CalendarRoutingModule,
    SatDatepickerModule, 
    SatNativeDateModule,
    MaterialModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'th-TH'},
    
  ]
})
export class CalendarModule { }
