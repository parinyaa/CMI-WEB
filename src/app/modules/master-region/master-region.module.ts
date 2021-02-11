import { MaterialElevationDirective } from './../../MaterialElevation.directive';
import { TambolEditRequest } from 'src/app/shared/models/tambol/request/tambolEditRequest';
import { TambolAddRequest } from 'src/app/shared/models/tambol/request/tambolAddRequst';
import { regionEditRequest } from './../../shared/models/region/request/regionEditRequest';
import { RegionAddRequest } from '../../shared/models/region/request/regionAddRequest';
import { AmphurEditRequest } from './../../shared/models/request/amphurEditRequest';
import { AmphurAddRequest } from './../../shared/models/request/amphurAddRequest';
import { ProvinceEditRequest } from './../../shared/models/request/provinceEditRequest';
import { DialogEditprovinceComponent } from './province/components/dialog-editprovince/dialog-editprovince.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ProvinceAddRequst } from './../../shared/models/request/provinceAddRequest';
import { RegionResponse } from 'src/app/shared/models/responses/regionResponse';
import { MaterialModule } from './../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRegionRoutingModule } from './master-region-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegionComponent } from './region/region.component';
import { ProvinceComponent } from './province/province.component';
import { AmphurComponent } from './amphur/amphur.component';
import { RegionService } from 'src/app/core/service/region/region.service';
import { ProvinceResponse } from 'src/app/shared/models/responses/provinceResponse';
import { DialogAddprovinceComponent } from './province/components/dialog-addprovince/dialog-addprovince.component';
import { DialogAddamphurComponent } from './amphur/components/dialog-addamphur/dialog-addamphur.component';
import { DialogEditamphurComponent } from './amphur/components/dialog-editamphur/dialog-editamphur.component';
import { TambolComponent } from './tambol/tambol.component';
import { DialogAddtambolComponent } from './tambol/components/dialog-addtambol/dialog-addtambol.component';
import { DialogEdittambolComponent } from './tambol/components/dialog-edittambol/dialog-edittambol.component';
import { DialogAddregionComponent } from './region/componets/dialog-addregion/dialog-addregion.component';
import { DialogEditregionComponent } from './region/componets/dialog-editregion/dialog-editregion.component';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';


@NgModule({
  declarations: [RegionComponent,ProvinceComponent, AmphurComponent, DialogAddprovinceComponent,
    DialogEditprovinceComponent, DialogAddamphurComponent, DialogEditamphurComponent,
    TambolComponent, DialogAddtambolComponent, DialogEdittambolComponent,
     DialogAddregionComponent, DialogEditregionComponent,MaterialElevationDirective ],
  imports: [
    CommonModule,
    MasterRegionRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn',
      confirmButtonText:'ตกลง',
      cancelButtonText:'ยกเลิก'
  }),
  FormsModule
  ],
  providers:[
    RegionService,
    RegionResponse,
    ProvinceResponse,
    ProvinceAddRequst,
    ProvinceEditRequest,
    AmphurAddRequest,
    AmphurEditRequest,
    RegionAddRequest,
    regionEditRequest,
    TambolAddRequest,
    TambolEditRequest,
    InputUtils
  ],
  entryComponents: [DialogAddprovinceComponent,DialogEditprovinceComponent,
    DialogAddamphurComponent,
    DialogEditamphurComponent,
    DialogAddtambolComponent,
    DialogEdittambolComponent,
    DialogAddregionComponent,
    DialogEditregionComponent
  ]
})
export class MasterRegionModule { }
