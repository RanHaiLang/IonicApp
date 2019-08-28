import {Component, ViewChild} from '@angular/core';
import {Platform, IonicApp, ToastController, Nav, Events, Keyboard, App, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import {NativeServiceProvider} from "../providers/native-service/native-service";
import {Storage} from "@ionic/storage";
import {HttpServiceProvider} from "../providers/http-service/http-service";
import {ConfigServiceProvider} from "../providers/config-service/config-service";
import {Md5} from "ts-md5";
import {AuthPage} from "../pages/auth/auth";
import {ErrorPage} from "../pages/error/error";
import {HelperProvider} from "../providers/helper/helper";
import {HomePage} from "../pages/home/home";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('myNav') nav: Nav;
  rootPage: any;
  username: string;
  password: string;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发

  keypage:any;
  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public nativeService: NativeServiceProvider, public storage: Storage,
              public httpService: HttpServiceProvider, public config: ConfigServiceProvider,
              public ionicApp: IonicApp, public toastCtrl: ToastController,private helper:HelperProvider,
              public events:Events,private keyboard: Keyboard,private app:App,public alertCtrl:AlertController,
              private iab: InAppBrowser,private sanitizer: DomSanitizer) {
    this.keypage = platform.getQueryParam("keypage");
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      nativeService.statusBarStyle();
      this.registerBackButtonAction();
      if(nativeService.isMobile()){
        this.helper.initJPush();
      }

      if(this.keypage == 1 ) {
        var usercode = this.platform.getQueryParam("usercode");
        if(usercode==undefined||usercode==""){
          this.rootPage=ErrorPage;
        }else{
          // //通过参数start
          // //* rcdtype  记录类型
          // //* rcdcode  记录编号
          // //* rcdorg   记录单位
          // //* usercode 用户编号
          // //* usergroup 用户工作组
          // //* displaytype 显示类型
          //
          var rcdcode = this.platform.getQueryParam("rcdcode");
          var rcdtype = this.platform.getQueryParam("rcdtype");
          var rcdorg = this.platform.getQueryParam("rcdorg");
          if(rcdcode==undefined||rcdcode==""||rcdtype==undefined||rcdtype==""||rcdorg==undefined||rcdorg==""){
            this.rootPage = ErrorPage;
          }else {
            var displaytype = this.platform.getQueryParam("displaytype");
            if(displaytype==undefined||displaytype==""){
              displaytype="DETAIL";
            }
            this.rootPage = AuthPage;
          }
          // // 通过参数finish

          // //用于sendid取值 start
          // var sendid = this.platform.getQueryParam("sendid");
          // if(sendid==undefined||sendid==""){
          //   this.rootPage = ErrorPage;
          // }else {
          //   var displaytype = this.platform.getQueryParam("displaytype");
          //   if (displaytype == undefined || displaytype == "") {
          //     displaytype = "DETAIL";
          //   }
          //
          //   this.rootPage = Auth1Page;
          // }
          // //用于sendid取值 finish

        }


      }else{
        this.VersionUpdate();
        //this.loginStatus();
      }
    });
  }


// 全局变量
  checkPage
// 判断当前页面
  goBackLogic() {
    var currentCmp = this.app.getActiveNav().getActive().component
    var isPage1= currentCmp === HomePage

    if (isPage1) {
      this.checkPage = true
    } else {
      this.checkPage = false
    }
  }

  // 注册android返回按键事件
  private registerBackEvent: Function
  registerBackButtonAction() {
    /*if (!this.nativeService.isAndroid()) {
      return;
    }
    this.platform.registerBackButtonAction(() => {
      if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
        this.keyboard.close();
        return;
      }
      //点击返回按钮隐藏toast或loading或Overlay
      this.ionicApp._toastPortal.getActive() ||this.ionicApp._loadingPortal.getActive()|| this.ionicApp._overlayPortal.getActive();
      //隐藏modal
      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        return;
      }
      //页面返回
      if(this.app.getRootNav().canGoBack()){
        //this.showExit() this.nativeService.minimize()
        return this.app.goBack()
      }else{
        return this.showExit();

      }
    }, 10);*/


    this.registerBackEvent = this.platform.registerBackButtonAction(() => {
      this.goBackLogic()
      console.log('监听右键Boolean值：' + this.checkPage)
      if (this.checkPage) {
        //如果是根目则按照需求1处理
        this.showExit()
      } else {
        //非根目录返回上一级页面
        this.app.goBack();
      }
      },10);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) {
      //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'top'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }



  //版本更新
  VersionUpdate(){
    //获取系统最新版本号
    var t ="";
    if(this.nativeService.isAndroid()){
      t='android'
    }else if(this.nativeService.isIos()){
      t='ios'
    }
    var url = this.config.url+"UpdatePage/checkNum?versionNum="+this.config.curreentversion+"&type="+t;

    this.httpService.get(url).subscribe((res)=>{
      let data = res.json();
      console.log("==")
      if(data['result']==0){
        if(this.nativeService.isAndroid()){
          //操作确认提示
          let alert = this.alertCtrl.create({
            title: '发现新版本',
            subTitle:data['getdesc'].replace("\r\n","<br/>"),
            enableBackdropDismiss:false,
            buttons: [
              {
                text: '立刻升级',
                handler: () => {
                  this.iab.create(data['url'],"_system","location=yes,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭")
                }
              }
            ]
          });
          alert.present();
        }else if(this.nativeService.isIos()){
          //操作确认提示
          let alert = this.alertCtrl.create({
            title: '发现新版本',
            subTitle:"请到app Store下载更新",
            enableBackdropDismiss:false,
            buttons: [
              {
                text: '确定',
                handler: () => {
                  //正式系统：1449946938
                  //培训系统：
                  this.iab.create('https://itunes.apple.com/cn/app/id1449946938?mt=8',"_system","location=yes,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭")
                }
              }
            ]
          });
          alert.present();
        }else {
          let alert = this.alertCtrl.create({
            title: '发现新版本',
            subTitle: data['getdesc'].replace("\r\n","<br/>"),
            enableBackdropDismiss:false,
            buttons: [
              {
                text: '立刻升级',
                handler: () => {
                  this.iab.create(data['url'],"_system","location=yes,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭")
                }
              }
            ]
          });
          alert.present();
        }
      }else {
        this.loginStatus();
      }

    })
  }
  assembleHTML(strHTML:any) {
    console.log(strHTML);
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
  }

  loginStatus(){
    this.storage.get("username").then((name)=>{
      this.username =  name;
      if(name==null||name==""||name==undefined){//如果username为空跳到登录页
        this.rootPage = LoginPage;
      }else {//如果username不为空直接请求登录接口
        this.storage.get("password").then((pass)=>{
          this.password = pass;
          var url = this.config.url+"appUser/login";
          var body = "username="+this.username+"&password="+Md5.hashStr(this.password);
          this.httpService.post(url,body).subscribe(
            data=>{
              let body = data.json();
              if(body['resultCode']==1){
                this.storage.set("username",this.username);
                this.storage.set("password",this.password);
                this.storage.set("usr_group",body['usr_group']);//存储用户组
                this.storage.set("ugrdesc",body['ugrdesc']);//存储用户组名称
                this.storage.set("usr_mrc",body['usr_mrc']);//存储部门
                this.storage.set("mrcdesc",body['mrcdesc']);//存储部门名称
                this.storage.set("name",body['name']);//用户姓名
                this.storage.set("org",body['org']);//用户组织
                this.storage.set("orgdesc",body['orgdesc']);//用户组织名称
                this.storage.set("token",body['token']);
                this.storage.set("usrudfchar06",body['usrudfchar06']);//用户转接单权限,+号能转接单
                this.rootPage = TabsPage;
              }else {
                this.nativeService.showToast(body['message'])
                this.storage.clear();
                this.rootPage = LoginPage;
              }
            },err=>{
              console.log("失败");
              this.rootPage = LoginPage;
            }
          )
          this.rootPage = LoginPage;
        })
      }
    })
  }

}
