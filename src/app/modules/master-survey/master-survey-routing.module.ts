import { DataConfigComponent } from './component/data-config/data-config.component';
import { SurveyComponent } from './page/survey.component';
import { AppLayoutComponent } from './../../core/app-layout/app-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/service/user/AuthGuard';
import { DialogEditsourceComponent } from '../master-source/component/dialog-editsource/dialog-editsource.component';


const routes: Routes = [
  {
    path: "", component: SurveyComponent,
    // children: [
    // { path:'editsource',component: DialogEditsourceComponent,canActivate:[AuthGuard]},
    // { path:'dataconfig',component: DataConfigComponent,canActivate:[AuthGuard]}
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSurveyRoutingModule { }
