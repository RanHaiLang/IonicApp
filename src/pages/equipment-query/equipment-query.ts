import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Events} from 'ionic-angular';
import { RepairPage } from '../repair-list/repair/repair';
import {EquipmentListComponent} from "../../components/equipment-list/equipment-list";
import {Storage} from "@ionic/storage";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {isEmpty} from "rxjs/operators/isEmpty";
import {QrscannerPage} from "../shared/qrscanner/qrscanner";

/**
 * Generated class for the EquipmentQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-equipment-query',
  templateUrl: 'equipment-query.html',
})
export class EquipmentQueryPage {

  //基本信息、附件清单等展开收缩
  public tabSwitch:boolean[]=[true,true,true,true];

  public redClass:string="R";//未完成
  //维修事件展开收缩
  repairItem:any=[];
  token:any;
  equipment:any=[];
  repairList:any=[];
  documentList:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,
              public storage:Storage,public config:ConfigServiceProvider,public http:HttpServiceProvider,
              public native:NativeServiceProvider,private events:Events) {
    this.storage.get("token").then((token)=>{
      this.token = token;
      console.log("token:"+this.token)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EquipmentQueryPage');
  }
  //进入报修界面
  goToRepairPage(){
    this.navCtrl.push(RepairPage,{
      equiment:this.equipment,
      pageKey:'equimentquery'
    });
  }

  //设备列表
  getEquipment(){
    let modal = this.modalCtrl.create(EquipmentListComponent,{
      token:this.token
    });
    modal.onDidDismiss(data=>{
      if(data!=null&&data!=""){
        this.equipment = data;
        this.getObject();
      }
    });
    modal.present();
  }

  //扫描
  obj_code:any;
  BarcodeScan(){
    this.navCtrl.push('QrscannerPage').then(()=>{
      var _that = this;
      this.events.subscribe('qrscanner:result', data => {
        _that.obj_code = data;//截取扫描结果存入数组中
        if(_that.obj_code!=null&&_that.obj_code!=""&&_that.obj_code!="null"){
          var url = _that.config.url +"appEvent/selectObjectDetail";
          let body = "platform=ios&token="+_that.token+"&obj_code="+_that.obj_code;
          _that.http.post(url,body,false).subscribe((res)=>{
            let data = res.json();
            if(data['status']==0){
              _that.equipment = data['data']['r5Object'];
              console.log(_that.equipment);
              if(_that.equipment==null){
                _that.native.showToast("该设备不存在");
                _that.equipment=[];
              }else {
                if(_that.equipment['obj_code']!=null&&_that.equipment['obj_code']!=""&&_that.equipment['obj_code']!=undefined){
                  _that.getObject();
                }else {
                  _that.native.showToast("该设备不存在");
                }
              }
            }else {
              _that.native.showToast(data['data'])
            }
          })
        }else {
          _that.native.showToast("未获取到设备编号")
        }
      });
    })
  }

  docPath:any;
  getObject(){
    var url = this.config.url+"appEvent/selectEventList"
    let body = "platform=ios&token="+this.token+"&evt_object="+this.equipment['obj_code'];
    this.http.post(url,body).subscribe((res)=>{
      let data = res.json()['data'];
      this.docPath = data['docPath'];
      this.repairList = data['Events'];
      this.documentList = data['documentList'];
      this.repairItem=[];//清空后重新赋值
      for(var i=0;i<this.repairList.length;i++){
        if(this.repairList[i]['evt_status']=='R'){
          this.repairList[i]['evt_udfchar28']="未完成";
          this.repairItem.push(true);
        }else {
          this.repairList[i]['evt_udfchar28']="完成";
          this.repairItem.push(false);
        }
      }
    })
  }


}

export class Item{
  constructor(
    public title:string,
    public code:string,
    public repairDescribe:string,
    public time:string,
    public person:string,
    public faultDescribe:string,
    public reason:string,
    public actionDescribe:string,
    public type:string,
    public state:string,
  ){

  }
}
