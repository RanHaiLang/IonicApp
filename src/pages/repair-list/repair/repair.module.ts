import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepairPage } from './repair';
import {SelectPicturePageModule} from "../../shared/select-picture/select-picture.module";

@NgModule({
  declarations: [
    RepairPage,
  ],
  imports: [
    IonicPageModule.forChild(RepairPage),
    SelectPicturePageModule
  ],
})
export class RepairPageModule {}
