import { SourceEditRequest } from './../../shared/models/source/request/sourceeditrequest';
import { TambolserviceService } from './../../core/service/tambol/tambolservice.service';
import { TambolSearchRequest } from './../../shared/models/request/tambolsearchRequest';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../material.module';
import { SourceComponent } from './page/source.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterSourceRoutingModule } from './master-source-routing.module';
import { MatTableModule } from '@angular/material';
import { DialogSourceComponent } from './component/dialog-source/dialog-source.component';
import { DialogEditsourceComponent } from './component/dialog-editsource/dialog-editsource.component';


@NgModule({
  declarations: [SourceComponent, DialogSourceComponent, DialogEditsourceComponent],
  imports: [
    CommonModule,
    MasterSourceRoutingModule,
    MaterialModule,
    MatTableModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  entryComponents: [DialogSourceComponent,DialogEditsourceComponent],
  providers:[
    TambolSearchRequest,
    TambolserviceService,
    SourceEditRequest
  ],
  exports:[DialogEditsourceComponent]
})
export class MasterSourceModule { }
