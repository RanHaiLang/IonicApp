import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Auth1Page } from './auth1';

@NgModule({
  declarations: [
    Auth1Page,
  ],
  imports: [
    IonicPageModule.forChild(Auth1Page),
  ],
})
export class Auth1PageModule {}
