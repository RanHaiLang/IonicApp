import { Component } from '@angular/core';
import {NavController, App, AlertController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ChangePasswordPage } from './change-password/change-password';
import { AboutUsPage } from './about-us/about-us';
import {Storage} from "@ionic/storage";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {SharedQrcodePage} from "../shared-qrcode/shared-qrcode";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {HelperProvider} from "../../providers/helper/helper";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public username:string;
  public uname:string;
  public mrc_desc:string;
  public org:string;
  public orgdesc:string;
  public usr_group:string;
  public ugrdesc:string;
  constructor(public navCtrl: NavController,public storage:Storage,public app:App,
              public alertCtrl:AlertController,public config:ConfigServiceProvider,
              public natives:NativeServiceProvider,private helper:HelperProvider) {
      this.storage.get("name").then((name)=>{
        this.uname = name;
        console.log(name);
      })
      this.storage.get("username").then((res)=>{
        this.username= res;
      })
      this.storage.get("mrcdesc").then((res)=>{
        this.mrc_desc = res;
      })
      this.storage.get("org").then((res)=>{
        this.org = res;
      })
    this.storage.get("orgdesc").then((res)=>{
      this.orgdesc = res;
    })
    this.storage.get("usr_group").then((res)=>{
        console.log(res);
      this.usr_group = res;
    })
    this.storage.get("ugrdesc").then((res)=>{
      console.log(res);
      this.ugrdesc = res;
    })
  }
  logout() {
    const confirm = this.alertCtrl.create({
      title: '操作提示',
      message: '确认退出当前登录用户？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            this.storage.remove("username");
            this.storage.remove("password");
            this.helper.setAlias("")
            this.app.getRootNav().setRoot(LoginPage);
          }
        }
      ]
    });
    confirm.present();
  }
  goToChangePasswordPage(){
    this.navCtrl.push(ChangePasswordPage);
  }

  goToAboutUsPage(){
    this.navCtrl.push(AboutUsPage);
  }
  goToSharedQrcode(){
    this.navCtrl.push(SharedQrcodePage);
  }
}
