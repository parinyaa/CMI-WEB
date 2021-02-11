import {CommodityValidateComponent} from './commodity-validate.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {path: '', component: CommodityValidateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommodityValidateRoutingModule {
}
