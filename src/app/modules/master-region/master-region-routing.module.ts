import { AppLayoutComponent } from './../../core/app-layout/app-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionComponent } from './region/region.component';
import { ProvinceComponent } from './province/province.component';
import { AmphurComponent } from './amphur/amphur.component';
import { TambolComponent } from './tambol/tambol.component';


const routes: Routes = [
  { path:'',component:RegionComponent},
  { path:'province',component:ProvinceComponent,runGuardsAndResolvers:'always'},
  { path:'amphur',component:AmphurComponent,runGuardsAndResolvers:'always'},
  { path:'tambol',component:TambolComponent,runGuardsAndResolvers:'always'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRegionRoutingModule { }
