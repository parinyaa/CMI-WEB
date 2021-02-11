import { CalweightSuccessComponent } from './components/calweight-success/calweight-success.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculateWeightComponent } from './calculate-weight.component';


const routes: Routes = [
  {path:"",component:CalculateWeightComponent} ,
  {path:"resultweight",component:CalweightSuccessComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculateWeightRoutingModule { }
