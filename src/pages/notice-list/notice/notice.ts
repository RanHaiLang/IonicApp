import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * Generated class for the NoticePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notice',
  templateUrl: 'notice.html',
})
export class NoticePage {

  notice:any;
  content:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private sanitizer: DomSanitizer) {
    this.notice = this.navParams.get("notice");
    //console.log(this.notice.not_notice);
  }

  assembleHTML(strHTML:any) {
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticePage');
  }

}
