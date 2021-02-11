import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VersionQuestionPageComponent } from './components/version-question-page/version-question-page.component';
import { QustionPageComponent } from './components/qustion-page/qustion-page.component';
import { ResultDataPageComponent } from './components/result-data-page/result-data-page.component';


const routes: Routes = [
  {path:'',component:VersionQuestionPageComponent,runGuardsAndResolvers:'always'},
  {path:'question',component:QustionPageComponent,runGuardsAndResolvers:'always'},
  {path:'result',component:ResultDataPageComponent,runGuardsAndResolvers:'always'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionnaireRoutingModule { }
