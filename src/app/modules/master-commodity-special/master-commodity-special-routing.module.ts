import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterCommoditySpecialComponent } from './master-commodity-special.component';


const routes: Routes = [
  {path : "" , component: MasterCommoditySpecialComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterCommoditySpecialRoutingModule { }
