import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeightPageComponent } from '../calculate-weight-cpip/components/weight-page/weight-page.component';
import { WeightStep1ComponentComponent } from '../calculate-weight-cpip/components/weight-step1-component/weight-step1-component.component';
import { WeightStep2ComponentComponent } from '../calculate-weight-cpip/components/weight-step2-component/weight-step2-component.component';


const routes: Routes = [
  { path: "", component: WeightPageComponent },
  { path: 'step1', component: WeightStep1ComponentComponent },
  { path: 'step2', component: WeightStep2ComponentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculateWeightCpipRoutingModule { }
