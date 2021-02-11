import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingBaseyearModule } from './setting-baseyear.module';
import { SettingBaseyearComponent } from './setting-baseyear.component';


const routes: Routes = [
  { path: '', component: SettingBaseyearComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingBaseyearRoutingModule { }
