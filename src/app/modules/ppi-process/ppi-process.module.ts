import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PpiProcessRoutingModule } from './ppi-process-routing.module';
import { PpiProcessComponent } from './ppi-process.component';
import { FormProcessComponent } from './components/form-process/form-process.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentService } from 'src/app/core/service/document/document.service';
import { DocumentFileRequest } from 'src/app/shared/models/document/request/DocumentFileRequest';
import { AddDocumentRequest } from 'src/app/shared/models/document/request/AddDocumentRequest';
import { GetDocumentRequest } from 'src/app/shared/models/document/request/GetDocumentRequest';
import { BaseyearService } from 'src/app/core/service/baseyear/baseyear.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { DialogFileComponent } from './components/dialog-file/dialog-file.component';
import { GetDocumentFileRequest } from 'src/app/shared/models/document/request/GetDocumentFileRequest';
import { DownloadFileRequest } from 'src/app/shared/models/document/request/DownloadFileRequest';
import { DeleteDucumentRequest } from 'src/app/shared/models/document/request/DeleteDucumentRequest';


@NgModule({
  declarations: [PpiProcessComponent, FormProcessComponent, DialogFileComponent],
  imports: [
    CommonModule,
    PpiProcessRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  providers: [
    DocumentService,
    DocumentFileRequest,
    AddDocumentRequest,
    GetDocumentFileRequest,
    GetDocumentRequest,
    BaseyearService,
    DownloadFileRequest,
    ParamService,
    DeleteDucumentRequest

  ],
  entryComponents: [
   DialogFileComponent
  ]
})
export class PpiProcessModule { }
