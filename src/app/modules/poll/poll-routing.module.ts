import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendPollAnswerPageComponent } from './components/send-poll-answer-page/send-poll-answer-page.component';



const routes: Routes = [
  { path: '', component: SendPollAnswerPageComponent, runGuardsAndResolvers: 'always' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PollRoutingModule { }
