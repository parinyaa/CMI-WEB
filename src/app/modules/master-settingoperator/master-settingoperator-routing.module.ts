import { MasterSettingoperatorComponent } from './master-settingoperator.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:"",component:MasterSettingoperatorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSettingoperatorRoutingModule { }
