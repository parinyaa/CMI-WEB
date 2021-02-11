import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultCommodityPageComponent } from './components/result-commodity-page/result-commodity-page.component';


const routes: Routes = [
  { path: '', component: ResultCommodityPageComponent, runGuardsAndResolvers: 'always' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultCommodityRoutingModule { }
