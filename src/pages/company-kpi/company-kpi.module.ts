import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyKpiPage } from './company-kpi';

@NgModule({
  declarations: [
    CompanyKpiPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanyKpiPage),
  ],
})
export class CompanyKpiPageModule {}
