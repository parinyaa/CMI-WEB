import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexMatrixRoutingModule } from './index-matrix-routing.module';
import { IndexMatrixPageComponent } from './components/index-matrix-page/index-matrix-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { DialogAddIndexMatrixComponent } from './components/dialog-add-index-matrix/dialog-add-index-matrix.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [IndexMatrixPageComponent, DialogAddIndexMatrixComponent],
  imports: [
    CommonModule,
    IndexMatrixRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  }),
    FormsModule
  ],
  entryComponents:[
    DialogAddIndexMatrixComponent
  ]
})
export class IndexMatrixModule { }
