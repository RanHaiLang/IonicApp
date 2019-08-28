import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ConfigServiceProvider} from "../../providers/config-service/config-service";

/**
 * Generated class for the SharedQrcodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shared-qrcode',
  templateUrl: 'shared-qrcode.html',
})
export class SharedQrcodePage {

  serviceUrl:any="";
  qrcodeurl:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,private config:ConfigServiceProvider) {
    this.serviceUrl = this.config.url;
    if(this.serviceUrl=='http://47.99.163.40:8880/AuxEam/'){//测试环境
      this.qrcodeurl = './assets/imgs/测试二维码.png';
    }else {
      this.qrcodeurl = './assets/imgs/正式二维码.png';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharedQrcodePage');
  }

}
