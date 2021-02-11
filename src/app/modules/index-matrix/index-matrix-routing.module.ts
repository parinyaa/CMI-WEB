import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexMatrixPageComponent } from './components/index-matrix-page/index-matrix-page.component';


const routes: Routes = [
  {path:"",component:IndexMatrixPageComponent,
  children: [
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexMatrixRoutingModule { }
