import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowComponent } from './component/workflow.component';
import { ReviewRelativeComponentComponent } from './component/review-relative-component/review-relative-component.component';
import { ExtendedPeriodComponentComponent } from './component/extended-period-component/extended-period-component.component';
import { ReviewPriceComponentComponent } from './component/review-price-component/review-price-component.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowComponent,
    children: [
      { path: 'relative', component: ReviewRelativeComponentComponent },
      { path: 'period', component: ExtendedPeriodComponentComponent },
      { path: 'price', component: ReviewPriceComponentComponent},
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
