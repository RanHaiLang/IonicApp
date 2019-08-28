import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Events} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {EquipmentListComponent} from "../../../components/equipment-list/equipment-list";
import {ConfigServiceProvider} from "../../../providers/config-service/config-service";
import {HttpServiceProvider} from "../../../providers/http-service/http-service";
import {NativeServiceProvider} from "../../../providers/native-service/native-service";
import {RepairImplementPage} from "../repair-implement/repair-implement";
import {RepairListPage} from "../repair-list";
import {FileObj} from "../../../model/FileObj";
import {FileServiceProvider} from "../../../providers/file-service/file-service";

/**
 * Generated class for the RepairPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-repair',
  templateUrl: 'repair.html',
})
export class RepairPage {

  repair:Repair;
  username:string;
  token:any;
  fileObjList: FileObj[] = [];
  filePaths: FileObj[] = [];
  isrepair:any="repair";
  clickbutton:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage:Storage,
              public modalCtrl:ModalController,public config:ConfigServiceProvider,
              public http:HttpServiceProvider,public nativeService:NativeServiceProvider,
              public fileService:FileServiceProvider,private events:Events) {
    var evt_target = this.nativeService.dateFormat(new Date(),'yyyy-MM-dd')
    if(this.navParams.get("pageKey")=='equimentquery'){//设备信息查询页进入
      this.repair = this.navParams.get("equiment");
      this.repair['evt_code']='自动生成';
    }else {//故障维修列表页进入
      this.repair = new Repair('自动生成','','','','','','','','','','','',0,'','','','','',evt_target,'','','');
    }
    this.storage.get("username").then((username)=>{
      this.storage.get("name").then((uname)=>{
        this.username = username;
        this.repair = new Repair(
          '自动生成', '',
          this.repair['obj_code'],
          this.repair['obj_desc'],
          this.repair['obj_manufactmodel'],
          this.repair['obj_mrc'],
          this.repair['obj_udfchar03'],
          this.repair['obj_udfchar20'],
          this.repair['obj_udfchar21'],
          username, uname,new Date(), 0,
          this.repair['obj_obtype'],
          this.repair['obj_obrtype'],
          this.repair['obj_org'],
          this.repair['obj_udfchar01'],
          this.repair['obj_udfchar10'],
          evt_target,'',
          this.repair['obj_costcode'],
          this.repair['obj_udfchar05']);
        console.log(this.repair);
      })
    })
    this.storage.get("token").then((token)=>{
      this.token = token;
    })
  }

  //设备列表
  getEquipment(){
    let modal = this.modalCtrl.create(EquipmentListComponent,{
      token:this.token
    });
    modal.onDidDismiss(data=>{
        this.repair.evt_object = data['obj_code'];
        this.repair.obj_desc = data['obj_desc'];
        this.repair.evt_udfchar02 = data['obj_manufactmodel'];
        this.repair.evt_mrc = data['obj_mrc'];
        this.repair.evt_udfchar01 = data['obj_udfchar03'];
        this.repair.evt_udfchar16 = data['obj_udfchar20'];
        this.repair.evt_udfchar17 = data['obj_udfchar21'];
        this.repair.evt_obtype = data['obj_obtype'];
        this.repair.evt_obrtype = data['obj_obrtype'];
        this.repair.evt_object_org = data['obj_org'];
        this.repair.evt_location = data['obj_udfchar01'];
        this.repair.evt_udfchar15 = data['obj_udfchar10'];
        this.repair.evt_costcode = data['obj_costcode'];
        this.repair.evt_udfchar03 = data['obj_udfchar05']
    });
    modal.present();
  }

  insertBX(){
    var _that = this;
    var url = _that.config.url +"appEvent/insertbxevt?platform=ios&token="+this.token;
    _that.repair['evt_createdby'] = _that.username;
    _that.repair['evt_reported'] =_that.nativeService.getTime(new Date());
    console.log(_that.nativeService.getTime(new Date()));
    console.log(_that.repair['evt_reported']);
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    console.log("输入空格判断："+re.test(_that.repair['evt_desc']));

    var udfnum03 = (new Date(this.repair['evt_schedend'])).valueOf()-(new Date(this.repair['evt_target'])).valueOf();
    if(_that.repair['evt_target']==""||_that.repair['evt_target']==null){
      _that.nativeService.showToast("请选择计划开始时间")
    }else if(_that.repair['evt_schedend']==""||_that.repair['evt_schedend']==null){
      _that.nativeService.showToast("请选择计划完成时间")
    }else if(_that.repair['evt_desc']==""||_that.repair['evt_desc']==null){
      _that.nativeService.showToast("请填写故障维修描述")
    }else if(_that.repair['evt_object']==""||_that.repair['evt_object']==null){
      _that.nativeService.showToast("请选择设备")
    }else if(Number(udfnum03)<0){
      this.nativeService.showToast("计划开始时间应早于计划完成时间")
    }else {
      let body = JSON.stringify(_that.repair);
      _that.http.postJson(url,body).subscribe((res)=>{
        let data = res.json();
        _that.nativeService.showToast(data['data']['message']);
        if(data['status']==0){//报修成功
          this.clickbutton = true;
          let result =0;
          if(_that.filePaths.length>0){
            _that.fileService.upload(_that.filePaths,data['data']['evt_code'],function (res) {
              console.log("result:"+res)
              if(res==_that.filePaths.length){
                _that.navCtrl.push(RepairListPage);
              }
            })
          }else {
            _that.navCtrl.push(RepairListPage);
          }

        }
      })
    }

  }

  //扫描
  obj_code:any;
  scan=[];
  BarcodeScan(){
    this.navCtrl.push('QrscannerPage').then(()=>{
      var _that = this;
      this.events.subscribe('qrscanner:result', data => {
        console.log(data)
        _that.obj_code = data;//截取扫描结果存入数组中
        if(_that.obj_code!=null&&_that.obj_code!=""&&_that.obj_code!="null"){
          var url = _that.config.url +"appEvent/selectObjectDetail";
          let body = "platform=ios&token="+_that.token+"&obj_code="+_that.obj_code;
          _that.http.post(url,body,false).subscribe((res)=>{
            let data = res.json();
            if(data['status']==0){
              _that.scan = data['data']['r5Object'];
              if(_that.scan==null){
                _that.nativeService.showToast("该设备不存在");
              }else {
                if(_that.scan['obj_code']!=null&&_that.scan['obj_code']!=""&&_that.scan['obj_code']!=undefined){
                  _that.repair.evt_object = _that.scan['obj_code'];
                  _that.repair.obj_desc = _that.scan['obj_desc'];
                  _that.repair.evt_udfchar02 = _that.scan['obj_manufactmodel'];
                  _that.repair.evt_mrc = _that.scan['obj_mrc'];
                  _that.repair.evt_udfchar01 = _that.scan['obj_udfchar03'];
                  _that.repair.evt_udfchar16 = _that.scan['obj_udfchar20'];
                  _that.repair.evt_udfchar17 = _that.scan['obj_udfchar21'];
                  _that.repair.evt_obtype = _that.scan['obj_obtype'];
                  _that.repair.evt_obrtype = _that.scan['obj_obrtype'];
                  _that.repair.evt_object_org = _that.scan['obj_org'];
                  _that.repair.evt_location = _that.scan['obj_udfchar01'];
                  _that.repair.evt_udfchar15 = _that.scan['obj_udfchar10'];
                  _that.repair.evt_costcode = _that.scan['obj_costcode'];
                  _that.repair.evt_udfchar03 = _that.scan['obj_udfchar05']
                }else {
                  _that.nativeService.showToast("该设备不存在");
                }
              }

            }else {
              _that.nativeService.showToast(data['data'])
            }

          })
        }else {
          _that.nativeService.showToast("未获取到设备编号")
        }
      })
    })


  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RepairPage');
  }

}

export class Repair{
  constructor(
    public evt_code:any,//单据编号
    public evt_desc:any,//故障维修描述
    public evt_object:any,//故障设备编码
    public obj_desc:any,//故障设备名称
    public evt_udfchar02:any,//设备型号
    public evt_mrc:any,//工厂/部门
    public evt_udfchar01:any,//工厂/部门名称
    public evt_udfchar16:any,//安装区域
    public evt_udfchar17:any,//安装位置
    public evt_enteredby:any,//报修人
    public evt_enteredby_desc:any,//报修人名称
    public evt_reported:any,//故障报修时间
    public evt_udfnum01:number,//维修响应时长
    public evt_obtype:any,//设备类型
    public evt_obrtype:any,
    public evt_object_org:any,
    public evt_location:any,//基地
    public evt_udfchar15:any,//公司
    public evt_target:any,//计划开始时间
    public evt_schedend:any,//计划结束时间
    public evt_costcode:any,//成本中心代码
    public evt_udfchar03:any//成本中心代码名称
  ){
  }
}
