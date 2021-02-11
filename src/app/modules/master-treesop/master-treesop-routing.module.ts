import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterTreesopComponent } from './master-treesop.component';


const routes: Routes = [
  {path:"",component:MasterTreesopComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterTreesopRoutingModule { }
