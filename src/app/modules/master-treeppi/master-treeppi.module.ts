import { ParamService } from 'src/app/core/service/param/param.service';
import { PpiEditRequest } from './../../shared/models/ppitree/request/PpiEditRequest';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { PpitreeService } from './../../core/service/ppitree/ppitree.service';
import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterTreeppiRoutingModule } from './master-treeppi-routing.module';
import { MasterTreeppiComponent } from './master-treeppi.component';
import { TreePpiComponent } from './component/tree-ppi/tree-ppi.component';
import { TreeCpaComponent } from './component/tree-cpa/tree-cpa.component';
import { DialogAddtreeppiComponent } from './component/dialog-addtreeppi/dialog-addtreeppi.component';
import { PpiCreateRequest } from 'src/app/shared/models/ppitree/request/PpiCreateRequest';
import { DialogEdittreeppiComponent } from './component/dialog-edittreeppi/dialog-edittreeppi.component';
import { CpipGetParentIdRequest } from 'src/app/shared/models/ppitree/request/CpipGetParentIdRequest';


@NgModule({
  declarations: [MasterTreeppiComponent, TreePpiComponent, TreeCpaComponent, DialogAddtreeppiComponent, DialogEdittreeppiComponent],
  imports: [
    CommonModule,
    MasterTreeppiRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  providers:[
    PpitreeService,
    PpiCreateRequest,
    PpiEditRequest,
    ParamService,
    CpipGetParentIdRequest
  ],
  entryComponents: [DialogAddtreeppiComponent,DialogEdittreeppiComponent]
})
export class MasterTreeppiModule { }
