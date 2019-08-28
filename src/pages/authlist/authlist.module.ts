import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthlistPage } from './authlist';

@NgModule({
  declarations: [
    AuthlistPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthlistPage),
  ],
})
export class AuthlistPageModule {}
