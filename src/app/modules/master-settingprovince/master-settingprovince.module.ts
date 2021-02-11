import { ProvinceService } from './../../core/service/province/province.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterSettingprovinceRoutingModule } from './master-settingprovince-routing.module';
import { MasterSettingprovinceComponent } from './master-settingprovince.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogAddsettingprovinceComponent } from './components/dialog-addsettingprovince/dialog-addsettingprovince.component';
import { DialogEditsettingprovinceComponent } from './components/dialog-editsettingprovince/dialog-editsettingprovince.component';


@NgModule({
  declarations: [MasterSettingprovinceComponent, DialogAddsettingprovinceComponent, DialogEditsettingprovinceComponent],
  imports: [
    CommonModule,
    MasterSettingprovinceRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
  })
  ],
  providers:[
    ProvinceService
  ],
  entryComponents:[DialogAddsettingprovinceComponent,DialogEditsettingprovinceComponent]
})
export class MasterSettingprovinceModule { }
