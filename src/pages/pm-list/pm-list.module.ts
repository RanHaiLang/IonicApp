import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PmListPage } from './pm-list';

@NgModule({
  declarations: [
    PmListPage,
  ],
  imports: [
    IonicPageModule.forChild(PmListPage),
  ],
})
export class PmListPageModule {}
