import { SopEditRequest } from 'src/app/shared/models/soptree/request/SopEditRequest';
import { PpitreeService } from './../../core/service/ppitree/ppitree.service';
import { SoptreeService } from './../../core/service/soptree/soptree.service';
import { SopCreateRequest } from './../../shared/models/soptree/request/SopCreateRequest';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterTreesopRoutingModule } from './master-treesop-routing.module';
import { MasterTreesopComponent } from './master-treesop.component';
import { TreeNodeComponent } from './component/tree-node/tree-node.component';
import { TreeSopComponent } from './component/tree-sop/tree-sop.component';
import { DialogAddtreesopComponent } from './component/dialog-addtreesop/dialog-addtreesop.component';
import { DialogEdittreesopComponent } from './component/dialog-edittreesop/dialog-edittreesop.component';


@NgModule({
  declarations: [MasterTreesopComponent, TreeNodeComponent, TreeSopComponent, DialogAddtreesopComponent, DialogEdittreesopComponent],
  imports: [
    CommonModule,
    MasterTreesopRoutingModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn',
      cancelButtonText:'ยกเลิก',
      confirmButtonText:"ตกลง"
    }),
    MaterialModule
  ],
  providers:[
    SopCreateRequest,
    SoptreeService,
    PpitreeService,
    SopEditRequest
  ],
  entryComponents: [DialogAddtreesopComponent,DialogEdittreesopComponent]
})
export class MasterTreesopModule { }
