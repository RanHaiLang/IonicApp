import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkingHoursPage } from './working-hours';
import {SelectuserPage} from "../../components/selectuser/selectuser";

@NgModule({
  declarations: [
    WorkingHoursPage,
    SelectuserPage
  ],
  imports: [
    IonicPageModule.forChild(WorkingHoursPage),
  ],
  entryComponents: [SelectuserPage],
})
export class WorkingHoursPageModule {}
