import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanImplementPage } from './plan-implement';
import {ProjectbudgetListComponent} from "../../../components/projectbudget-list/projectbudget-list";
import {SelectPicturePageModule} from "../../shared/select-picture/select-picture.module";

@NgModule({
  declarations: [
    PlanImplementPage,
    ProjectbudgetListComponent
  ],
  imports: [
    IonicPageModule.forChild(PlanImplementPage),
    SelectPicturePageModule
  ],
  entryComponents: [ProjectbudgetListComponent]
})
export class PlanImplementPageModule {}
