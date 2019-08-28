import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedQrcodePage } from './shared-qrcode';

@NgModule({
  declarations: [
    SharedQrcodePage,
  ],
  imports: [
    IonicPageModule.forChild(SharedQrcodePage),
  ],
})
export class SharedQrcodePageModule {}
