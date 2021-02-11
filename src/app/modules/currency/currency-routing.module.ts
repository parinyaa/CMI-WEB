import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyPageComponent } from './components/currency-page/currency-page.component';


const routes: Routes = [
  { path: '', component: CurrencyPageComponent, runGuardsAndResolvers: 'always' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyRoutingModule { }
