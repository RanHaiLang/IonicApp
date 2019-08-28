import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Nav, App, Platform} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {Md5} from "ts-md5";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {Storage} from "@ionic/storage";
import {HelperProvider} from "../../providers/helper/helper";
import {BackButtonProvider} from "../../providers/back-button/back-button";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('mainTabs') nav :Nav
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public nativeService:NativeServiceProvider,public config:ConfigServiceProvider,
              public httpService:HttpServiceProvider,public storage:Storage,public app:App,
              private helper:HelperProvider,public platform: Platform,private backButtonService:BackButtonProvider) {
    console.log("====")
    console.log(this.navParams)
    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(null);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  logIn(username: HTMLInputElement, password : HTMLInputElement) {
    var _that = this;
    if(username.value==""){
      this.nativeService.showToast("请输入用户名")
    }else if (password.value==""){
      this.nativeService.showToast("请输入密码")
    }else {
      var url = this.config.url+"appUser/login";
      var body = "username="+username.value+"&password="+Md5.hashStr(password.value);
      this.httpService.post(url,body).subscribe(
        data=>{
          let body = data.json();
          if(body['resultCode']==1){
            this.helper.setAlias(username.value)
            this.storage.set("username",username.value);
            this.storage.set("password",password.value);
            this.storage.set("usr_group",body['usr_group']);//存储用户组
            this.storage.set("ugrdesc",body['ugrdesc']);//存储用户组名称
            this.storage.set("usr_mrc",body['usr_mrc']);//存储部门
            this.storage.set("mrcdesc",body['mrcdesc']);//存储部门名称
            this.storage.set("name",body['name']);//用户姓名
            this.storage.set("org",body['org']);//用户组织
            this.storage.set("orgdesc",body['orgdesc']);//用户组织名称
            this.storage.set("usrudfchar06",body['usrudfchar06']);//用户转接单权限,+号能转接单
            this.storage.set("token",body['token']).then(function () {
              _that.app.getActiveNav().setRoot(TabsPage)
            })
          }else {
            this.nativeService.showToast(body['message'])
          }
        }
      )
    }
  }
}
