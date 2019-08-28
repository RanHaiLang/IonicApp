import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, App} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {NativeServiceProvider} from "../../../providers/native-service/native-service";
import {HttpServiceProvider} from "../../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../../providers/config-service/config-service";
import {Md5} from "ts-md5";
import {LoginPage} from "../../login/login";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  oldPassword:string="";
  newPassword:string="";
  conPassword:string="";
  token:string;
  username:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private storage:Storage,public nativeService:NativeServiceProvider,
              public httpService:HttpServiceProvider,public config:ConfigServiceProvider,
              private app:App) {
    this.storage.get("username").then((username)=>{
      this.username = username;
    })
    this.storage.get("token").then((token)=>{
      this.token = token;
    })
  }

  confModification(){
    if(this.oldPassword==""){
      this.nativeService.showToast("请输入原密码！")
    }else if(this.newPassword==""){
      this.nativeService.showToast("请输入新密码！")
    }else if(this.conPassword==""){
      this.nativeService.showToast("请输入确认密码！")
    }else if(this.conPassword!=this.newPassword){
      this.nativeService.showToast("新密码和确认密码不一致！")
    }else {
      var url = this.config.url+"appUser/user/changePass";
      var body = "username="+this.username+"&password="+Md5.hashStr(this.oldPassword)+"&newPass="+Md5.hashStr(this.newPassword);
      this.httpService.httpOptions.headers.delete("token");
      this.httpService.httpOptions.headers.append("token",this.token);
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json();
        if(data['resultCode']==1){
          this.storage.remove("token");
          this.nativeService.showToast("密码修改成功");
          this.app.getRootNav().setRoot(LoginPage);
        }else {
          this.nativeService.showToast(data['message'])
        }
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

}
