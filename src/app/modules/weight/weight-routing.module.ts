import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeightPageComponent } from './components/weight-page/weight-page.component';


const routes: Routes = [
  { path: "", component: WeightPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeightRoutingModule { }
