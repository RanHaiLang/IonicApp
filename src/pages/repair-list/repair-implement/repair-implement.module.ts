import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepairImplementPage } from './repair-implement';
import {RequircodeListComponent} from "../../../components/requircode-list/requircode-list";
import {StandworkListComponent} from "../../../components/standwork-list/standwork-list";
import {SelectPicturePageModule} from "../../shared/select-picture/select-picture.module";
import {OpinionComponent} from "../../../components/opinion/opinion";

@NgModule({
  declarations: [
    RepairImplementPage,
    RequircodeListComponent,
    StandworkListComponent,
    OpinionComponent
  ],
  imports: [
    IonicPageModule.forChild(RepairImplementPage),
    SelectPicturePageModule
  ],
  entryComponents: [RequircodeListComponent,StandworkListComponent,OpinionComponent],
})
export class RepairImplementPageModule {}
