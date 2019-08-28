import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {NativeServiceProvider} from "../native-service/native-service";
import {JPush} from "@jiguang-ionic/jpush";
import {App, AlertController} from "ionic-angular";
import {OpenNativeSettings} from "@ionic-native/open-native-settings";

/*
  Generated class for the HelperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HelperProvider {

  constructor(public http: HttpClient,private nativeService: NativeServiceProvider,
              private jPush:JPush,private settings:OpenNativeSettings,public alertCtrl:AlertController) {
    console.log('Hello HelperProvider Provider');
  }

  initJPush() {
    //启动极光推送
    this.jPush.init();
    if (this.nativeService.isIos()) {
      //this.jPush.setBadge(0);
      this.jPush.setDebugMode(true);
      this.jPush.setApplicationIconBadgeNumber(0);
    } else {
      this.jPush.setDebugMode(true);
    }
    this.jPushAddEventListener();
  }
  msgList:Array<any>=[];

  jPushAddEventListener() {
    //判断系统设置中是否允许当前应用推送
    console.log("判断系统设置中是否允许当前应用推送")
    this.jPush.getUserNotificationSettings().then((result)=>{
      console.log("result:"+result);
      console.log(result)
      if (result == 0) {
        console.log('系统设置中已关闭应用推送');
        const confirm = this.alertCtrl.create({
          title: '系统提示',
          message: '系统设置中未打开应用通知',
          buttons: [
            {
              text: '关闭',
              handler: () => {
                console.log('Disagree clicked');
              }
            },
            {
              text: '前往设置',
              handler: () => {
                console.log("前往设置")
                this.settings.open("application_details").then((res)=>{
                  console.log(res)
                })
              }
            }
          ]
        });
        confirm.present();
      } else if (result > 0) {
        console.log('系统设置中打开了应用推送');
      }
    });
    //点击通知进入应用程序时会触发的事件
    document.addEventListener("jpush.openNotification", event => {
      if(this.nativeService.isIos()){
        this.jPush.setBadge(0);
        this.jPush.setDebugMode(true);
        this.jPush.setApplicationIconBadgeNumber(0);
      }
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      this.msgList = content;
      console.log("jpush.openNotification" + content);
      this.nativeService.showAlert("消息提示",content);
    }, false);

    //收到通知时会触发该事件
    document.addEventListener("jpush.receiveNotification", event => {
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      this.msgList = content;
      console.log("jpush.receiveNotification" + content);
    }, false);

    //收到自定义消息时触发这个事件
    document.addEventListener("jpush.receiveMessage", event => {
      let message = this.nativeService.isIos() ? event['content'] : event['message'];
      console.log("jpush.receiveMessage" + message);
    }, false);

    //设置标签/别名回调函数
    document.addEventListener("jpush.setTagsWithAlias", event => {
      console.log("onTagsWithAlias");
      let result = "result code:" + event['resultCode'] + " ";
      result += "tags:" + event['tags'] + " ";
      result += "alias:" + event['alias'] + " ";
      console.log(result);
    }, false);

  }
  //设置别名,一个用户只有一个别名
  public setAlias(userId) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    console.log('设置setAlias:' + userId);
    //ios设置setAlias有bug,值必须为string类型,不能是number类型
    this.jPush.setAlias({ sequence: 1, alias: ''+userId });
  }
}
