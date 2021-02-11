import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MigratePriceDataComponent } from './migrate-price-data.component';


const routes: Routes = [
  {path:'',component:MigratePriceDataComponent,}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MigratePriceDataRoutingModule { }
