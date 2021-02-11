import { InputTypeNumber } from './../core/utils/inputTypeNumber';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThaiDatePipePipe } from '../core/utils/dateUtils/thai-date-pipe.pipe';
import { SubStringDescriptionPipe } from '../core/utils/stringUtils/sub-string-description.pipe';
import { Weight5DecimalPipe } from '../core/utils/weightUtils/weight5-decimal.pipe';
import { SplitWorkflowDescPipe } from '../core/utils/workflowUtils/split-workflow-desc.pipe';
import { SubDurationPipe } from '../core/utils/stringUtils/sub-duration.pipe';
import { FilterIndexGroupComponent } from './component/filter-index-group/filter-index-group.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [
    ThaiDatePipePipe,
    SubStringDescriptionPipe,
    Weight5DecimalPipe,
    SplitWorkflowDescPipe,
    InputTypeNumber,
    SubDurationPipe,
    FilterIndexGroupComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  }),
  ],
  exports: [
    ThaiDatePipePipe,
    SubStringDescriptionPipe,
    Weight5DecimalPipe,
    SplitWorkflowDescPipe,
    InputTypeNumber,
    SubDurationPipe,
    FilterIndexGroupComponent
  ]
})
export class SharedModule { }
