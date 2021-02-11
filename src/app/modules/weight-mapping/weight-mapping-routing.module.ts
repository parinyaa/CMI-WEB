import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeightMappingComponent } from './weight-mapping.component';


const routes: Routes = [
  { path: "", component: WeightMappingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeightMappingRoutingModule { }
