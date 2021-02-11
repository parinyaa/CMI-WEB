import { MasterMappspecComponent } from './modules/master-mappspec/master-mappspec.component';
import { LoginLayoutComponent } from './core/login-layout/login-layout.component';
import { AppLayoutComponent } from './core/app-layout/app-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/service/user/AuthGuard';
import { DataentyComponent } from './modules/dataenty/dataenty.component';
import { CommodityValidateModule } from './modules/commodity-validate/commodity-validate.module';
import { CommodityValidateComponent } from './modules/commodity-validate/commodity-validate.component';
import { CalculateIndexWeightComponent } from './modules/commodity-validate/calculate-index-weight/calculate-index-weight.component';
import { ResultCommodityPageComponent } from './modules/result-commodity/components/result-commodity-page/result-commodity-page.component';
import { ResultWeightPageComponent } from './modules/result-commodity/components/result-weight-page/result-weight-page.component';
import { ResultIndexPageComponent } from './modules/result-commodity/components/result-index-page/result-index-page.component';
import { ResultSopWeightPageComponent } from './modules/result-commodity/components/result-sop-weight-page/result-sop-weight-page.component';
import { ResultSopIndexPageComponent } from './modules/result-commodity/components/result-sop-index-page/result-sop-index-page.component';
import { MigratePriceDataComponent } from './modules/migrate-price-data/migrate-price-data.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      // {path:'',component:HomePageComponent},
      { path: '', loadChildren: '../app/modules/workflow/workflow.module#WorkflowModule' },
      { path: 'region', loadChildren: '../app/modules/master-region/master-region.module#MasterRegionModule' },
      { path: 'source', loadChildren: '../app/modules/master-source/master-source.module#MasterSourceModule' },
      { path: 'survey', loadChildren: '../app/modules/master-survey/master-survey.module#MasterSurveyModule' },
      {
        path: 'stakeholder',
        loadChildren: () => import('./modules/master-stakeholder/master-stakeholder.module').then(mod => mod.MasterStakeholderModule)
      },
      { path: 'keyinweek', loadChildren: '../app/modules/keyin-dataweek/keyin-dataweek.module#KeyinDataweekModule' },
      // { path: 'calculateweight', loadChildren: '../app/modules/calculate-weight/calculate-weight.module#CalculateWeightModule' },
      { path: 'commoditycal', loadChildren: '../app/modules/master-commoditycal/master-commoditycal.module#MasterCommoditycalModule' },
      {
        path: 'settingprovince',
        loadChildren: '../app/modules/master-settingprovince/master-settingprovince.module#MasterSettingprovinceModule'
      },
      {
        path: 'settingoperator',
        loadChildren: '../app/modules/master-settingoperator/master-settingoperator.module#MasterSettingoperatorModule'
      },
      { path: 'mock', loadChildren: '../app/modules/mock-page/mock-page.module#MockPageModule' },
      { path: 'processppi', loadChildren: '../app/modules/ppi-process/ppi-process.module#PpiProcessModule' },
      { path: 'commodityvalidate', component: CommodityValidateComponent },
      { path: 'indexAndWeight', component: CalculateIndexWeightComponent },
      { path: 'syncbaseyear', loadChildren: '../app/modules/sync-baseyear/sync-baseyear.module#SyncBaseyearModule' },
      { path: 'params', loadChildren: '../app/modules/master-params/master-params.module#MasterParamsModule' },
      {
        path: 'questionnaire',
        loadChildren: () => import('./modules/questionnaire/questionnaire.module').then(mod => mod.QuestionnaireModule)
      },
      { path: 'treecpip', loadChildren: '../app/modules/master-treeppi/master-treeppi.module#MasterTreeppiModule' },
      { path: 'treesop', loadChildren: '../app/modules/master-treesop/master-treesop.module#MasterTreesopModule' },
      {
        path: 'dataenty', component: DataentyComponent, children: [
          { path: 'keyin', loadChildren: '../app/modules/keyin-data/keyin-data.module#KeyinDataModule' },
          { path: 'keyindaily', loadChildren: '../app/modules/keyin-daily/keyin-daily.module#KeyinDailyModule' }
        ]
      },
      { path: 'mapspec', loadChildren: '../app/modules/master-mappspec/master-mappspec.module#MasterMappspecModule' },
      {
        path: 'currency',
        loadChildren: () => import('./modules/currency/currency.module').then(mod => mod.CurrencyModule)
      },
      {
        path: 'inquiryrelative', component: ResultCommodityPageComponent
      },
      {
        path: 'inquiryweight', component: ResultWeightPageComponent
      },
      {
        path: 'inquiryindex', component: ResultIndexPageComponent
      },
      {
        path: 'inquirySopweight', component: ResultSopWeightPageComponent
      },
      {
        path: 'inquirySopindex', component: ResultSopIndexPageComponent
      },
      {
        path: 'calendar',
        loadChildren: () => import('./modules/calendar/calendar.module').then(mod => mod.CalendarModule)
      },
      {
        path: 'createbaseyear',
        loadChildren: () => import('./modules/create-info-baseyear/create-info-baseyear.module').then(mod => mod.CreateInfoBaseyearModule)
      },
      // {
      //   path: 'calculateweight',
      //   loadChildren: () => import('./modules/weight/weight.module').then(mod => mod.WeightModule)
      // }
      {
        path: 'calculateweight',
        loadChildren: () => import('./modules/calculate-weight-cpip/calculate-weight-cpip.module').then(mod => mod.CalculateWeightCpipModule)
      },
      {
        path: 'fetchdata',
        loadChildren: () => import('./modules/migrate-price-data/migrate-price-data.module').then(mod => mod.MigratePriceDataModule)
      },
      // {
      //   path: 'workflow',
      //   loadChildren: () => import('./modules/workflow/workflow.module').then(mod => mod.WorkflowModule)
      // }
      {
        path: 'index_matrix',
        loadChildren: () => import('./modules/index-matrix/index-matrix.module').then(mod => mod.IndexMatrixModule)
      },
      {
        path: 'specialmapping',
        loadChildren: () => import('./modules/master-commodity-special/master-commodity-special.module').then(mod => mod.MasterCommoditySpecialModule)
      },
      {
        path: 'createbaseyear-region',
        loadChildren: () => import('./modules/create-baseyear-region/create-baseyear-region.module').then(mod => mod.CreateBaseyearRegionModule)
      },
      {
        path: 'setting-baseyear',
        loadChildren: () => import('./modules/setting-baseyear/setting-baseyear.module').then(mod => mod.SettingBaseyearModule)
      },
      {
        path: 'weightmapping',
        loadChildren: () => import('./modules/weight-mapping/weight-mapping.module').then(mod => mod.WeightMappingModule)
      }
    ],
    canActivate: [AuthGuard]

  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', loadChildren: '../app/modules/user-login/user-login.module#UserLoginModule' },
      { path: 'poll', loadChildren: () => import('./modules/poll/poll.module').then(mod => mod.PollModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}


