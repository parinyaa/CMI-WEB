import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateBaseyearRegionComponent } from './create-baseyear-region.component';


const routes: Routes = [
  { path: "", component: CreateBaseyearRegionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateBaseyearRegionRoutingModule { }
