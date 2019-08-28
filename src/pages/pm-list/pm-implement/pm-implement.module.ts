import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PmImplementPage } from './pm-implement';
import {SelectPicturePageModule} from "../../shared/select-picture/select-picture.module";

@NgModule({
  declarations: [
    PmImplementPage,
  ],
  imports: [
    IonicPageModule.forChild(PmImplementPage),
    SelectPicturePageModule
  ],
})
export class PmImplementPageModule {}
