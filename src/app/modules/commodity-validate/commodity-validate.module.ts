import  localeTh  from '@angular/common/locales/th';
import { KeyinDataModule } from './../keyin-data/keyin-data.module';
import { ValidateserviceService } from '../../core/service/validate/validateservice.service';
import { MaterialModule } from 'src/app/material.module';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import { CommodityValidateRoutingModule } from './commodity-validate-routing.module';
import { CommodityValidateComponent } from './commodity-validate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material';
import { CommodityService } from '../../core/service/commodity/commodity.service';
import { CalculateIndexWeightComponent } from './calculate-index-weight/calculate-index-weight.component';
import { PopupComponent } from './popup/popup.component';
import { TwodigitdecimaldirectiveDirective } from './directive/twodigitdecimaldirective.directive';
import { PopupInboxdetailDetailComponent } from './popup-inboxdetail-detail/popup-inboxdetail-detail.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DialogCommentValidateComponent } from './dialog-comment-validate/dialog-comment-validate.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CommodityValidateComponent,
    CalculateIndexWeightComponent,
    PopupComponent,
    TwodigitdecimaldirectiveDirective,
    PopupInboxdetailDetailComponent,
    DialogCommentValidateComponent
  ],
  imports: [
    CommonModule,
    CommodityValidateRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    MatBadgeModule,
    KeyinDataModule,
    FormsModule,
    SweetAlert2Module,
    SharedModule
  ],
  providers: [
    ValidateserviceService,
    CommodityService,
  ],
  entryComponents: [
    PopupComponent,
    PopupInboxdetailDetailComponent,
    DialogCommentValidateComponent
  ]
})
export class CommodityValidateModule { }
