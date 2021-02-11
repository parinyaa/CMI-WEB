import { CreateInfoBaseyearComponent } from './create-info-baseyear.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:"",component:CreateInfoBaseyearComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateInfoBaseyearRoutingModule { }
