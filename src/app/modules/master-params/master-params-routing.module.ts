import { MasterParaminfoComponent } from './component/master-paraminfo/master-paraminfo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterParamsComponent } from './master-params.component';


const routes: Routes = [
  {path:"",component:MasterParamsComponent},
  {path:"paraminfo",component:MasterParaminfoComponent,runGuardsAndResolvers:'always'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterParamsRoutingModule { }
