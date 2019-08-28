import {Component, ViewChild} from '@angular/core';

import { MenuPage } from '../menu/menu';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import {Platform, Tabs} from "ionic-angular";
import {BackButtonProvider} from "../../providers/back-button/back-button";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MenuPage;
  tab3Root = ContactPage;

  @ViewChild('myTabs') tabRef: Tabs;
  constructor(public platform: Platform,private backButtonService:BackButtonProvider) {
    /*this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(this.tabRef);
    });*/
  }
}
