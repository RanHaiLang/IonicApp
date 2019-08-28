import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkHistoryQueryPage } from './work-history-query';

@NgModule({
  declarations: [
    WorkHistoryQueryPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkHistoryQueryPage),
  ],
})
export class WorkHistoryQueryPageModule {}
