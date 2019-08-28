import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EquipmentQueryPage } from './equipment-query';
import {EquipmentListComponent} from "../../components/equipment-list/equipment-list";
import {QrscannerPageModule} from "../shared/qrscanner/qrscanner.module";

@NgModule({
  declarations: [
    EquipmentQueryPage,
    EquipmentListComponent
  ],
  imports: [
    IonicPageModule.forChild(EquipmentQueryPage),
    QrscannerPageModule
  ],
  entryComponents: [EquipmentListComponent],
})
export class EquipmentQueryPageModule {}
