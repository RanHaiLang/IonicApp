import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ActionSheetController, ModalController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";

/**
 * Generated class for the Auth1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auth1',
  templateUrl: 'auth1.html',
})
export class Auth1Page {

//基本信息等title展开收缩
  public tabSwitch: boolean[] = [true, true, true, true, true];

  //页面参数
  pmpage: any = [];
  //提交参数
  pmauth:any = [];
  //审批信息
  authmessage: any = [];
  //记录基础信息
  rcdbaseinfo: any = [];
  //记录信息
  rcdinfo: any = [];
  //rcdinfoupdate: any = [];
  rcdinfolabels: any = [];
  rcdinfovalues: any = [];
  //审批记录
  rcdadd: any = [];
  //审批操作
  rcdauth: any = [];
  //附件信息
  rcddoc: any = [];
  //子信息
  rcdlines: any = [];
  //请示明细展开收缩
  detailsItem: any = [false, false, false];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              private actionsheetCtrl: ActionSheetController,
              public modalCtrl: ModalController, public storage: Storage,
              public httpService: HttpServiceProvider, public config: ConfigServiceProvider,
              public nativeService: NativeServiceProvider) {
    this.pmpage['sendid'] = this.platform.getQueryParam("sendid");
    this.pmpage['usercode'] = this.platform.getQueryParam("usercode");
    this.pmpage['displaytype'] = this.platform.getQueryParam("displaytype");
    //console.log(this.pmpage);
    this.getAuthDetail();


  }

  getAuthDetail() {
    console.log("getAuthDetail start");
    //用于sendid取值
    var url = this.config.localurl + "approve/getrcd";
    let body = "sendid=" + this.pmpage['sendid']
      + "&usercode=" + this.pmpage['usercode']
      + "&displaytype=" + this.pmpage['displaytype']
    ;
    console.log(body);

    this.httpService.post(url, body).subscribe((res) => {
      if(res.json()['status']==undefined||res.json()['status']==1){
        this.nativeService.showAlert("系统提示",res.json()['data']);
        return;
      }
      let data = res.json()['data'];
      console.log(data);
      this.authmessage = data;
      if (this.authmessage['BASEINFO'] != undefined && this.authmessage['BASEINFO'].length > 0) {
        this.rcdbaseinfo = this.authmessage['BASEINFO'][0];
        //console.info(this.rcdbaseinfo);
        this.pmauth['rcdstatus'] = this.rcdbaseinfo['RCDSTATUS'];
        this.pmauth['rcdentity'] = this.rcdbaseinfo['rcdentity'];
        this.pmauth['rcdcode'] = this.rcdbaseinfo['RCDCODE'];
        this.pmauth['rcdtype'] = this.rcdbaseinfo['rcdtype'];
        this.pmauth['usercode'] = this.rcdbaseinfo['usercode'];
        this.pmauth['rcdorg'] = this.rcdbaseinfo['RCDORG'];
        this.pmauth['rcdclass'] = this.rcdbaseinfo['RCDCLASS'];

      }

      this.rcdinfo = this.authmessage['INFO'];
      if (this.rcdinfo != undefined) {
        if (this.rcdinfo['lines'] != undefined
          && this.rcdinfo['lines'].length > 0
          && this.rcdinfo['lines'][0]['labels'] != undefined) {
          this.rcdinfolabels = this.rcdinfo['lines'][0]['labels'];
          if (this.rcdinfo['lines'][0]['values'] != undefined) {
            this.rcdinfovalues = this.rcdinfo['lines'][0]['values'];
          }
        }
      } else {
        this.rcdinfo = [];
      }
      if (this.authmessage['DOC'] != undefined) {
        this.rcddoc = this.authmessage['DOC'];
      }
      if (this.authmessage['ADD'] != undefined) {
        this.rcdadd = this.authmessage['ADD'];
      }
      if (this.authmessage['AUTH'] != undefined) {
        this.rcdauth = this.authmessage['AUTH'];
        if (this.rcdauth == undefined) {
          this.rcdauth = [];
        }else {
          if (this.rcdbaseinfo['RCDUCOWEIGHT'] == undefined) {
          } else {
            if (this.rcdbaseinfo['RCDUCOWEIGHT'] >= 2) {
              this.rcdauth = [];
              this.rcdauth.push({'aut_statnew': 'csign', 'autstatnewdesc': '会签'});
            }
          }
        }
        this.nextStatus();
      }

      if (this.authmessage['LINES'] == undefined || this.authmessage['LINES'].length < 1) {
      } else {
        this.rcdlines = this.authmessage['LINES'];
        if (this.rcdlines == undefined) {
          this.rcdlines = [];
        }
      }
      //console.log("this.rcdlines.length");
      //console.log(this.rcdlines.length);
      // if(this.rcdlines==undefined||this.rcdlines.length<1){
      //
      // }
      //console.log(this.rcdlines);
    })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Auth1Page');
  }

  buttons: any = [];

  StatusButton() {//流程按钮
    let that = this;
    that.actionsheetCtrl.create(
      {
        buttons: this.buttons
      }).present();
  }

  //获取下一步状态按钮
  statusButton: any = [];

  nextStatus() {
    //console.info("nextStatus:"+this.rcdauth);
    console.info(this.rcdauth);
    for (let i = 0; i < this.rcdauth.length; i++) {
      this.buttons.push({
        text: this.rcdauth[i].autstatnewdesc, handler: () => {
          this.updateAuth(this.rcdauth[i].aut_statnew);
        }
      })
    }
    this.buttons.push({text: '取消', role: 'cancel'})
  }

  //审批
  updateAuth(aut_status) {
    var url = this.config.localurl + "approve/authrecord";
    //console.info(url);
    if(this.pmauth['rcdaddetail']==undefined||this.pmauth['rcdaddetail']==""){
      //this.nativeService.showAlert("系统提示","没有填写审批意见");
      this.nativeService.showToast("没有填写审批意见");
      return;
    }
    console.info(this.pmauth);
    // let body = JSON.stringify(this.pm);

    let body = "rcdcode=" + this.pmauth['rcdcode']
      + "&rcdtype=" + this.pmauth['rcdtype']
      + "&rcdentity=" + this.pmauth['rcdentity']
      + "&usercode=" + this.pmauth['usercode']
      + "&rcdstatus=" + this.pmauth['rcdstatus']
      + "&rcdorg=" + this.pmauth['rcdorg']
      + "&rcdaddetail=" + this.pmauth['rcdaddetail']
      + "&rcdstatusnew=" + aut_status
      + "&rcdsource=W"
      + "&rcdclass=" + this.pmauth['rcdclass']
    ;
    console.log(body);
    this.httpService.post(url, body).subscribe((res) => {
      let data = res.json();
      console.log(data);
      this.nativeService.showToast(data['data']);
      if(data['status']==0){
        this.pmauth['rcdaddetail']='';
        //this.rcdauth = [];
        this.buttons = [];
        this.getAuthDetail();
      }
    })  }
}
