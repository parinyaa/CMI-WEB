import {DataentyComponent} from './dataenty.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {path: 'dataentry', component: DataentyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataentyRoutingModule {
}
