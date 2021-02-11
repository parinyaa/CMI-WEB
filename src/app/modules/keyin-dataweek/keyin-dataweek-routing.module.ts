import { KeyinDataweekComponent } from './keyin-dataweek.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:"",component:KeyinDataweekComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeyinDataweekRoutingModule { }
