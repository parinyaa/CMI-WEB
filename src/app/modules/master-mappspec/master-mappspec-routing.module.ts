import { MapspecComponent } from './components/mapspec/mapspec.component';
import { MasterMappspecComponent } from './master-mappspec.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:"",component:MasterMappspecComponent},
  {path:"map",component:MapspecComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterMappspecRoutingModule { }
