import { Component, ViewChild } from '@angular/core';
import {NavController, Slides, Events} from 'ionic-angular';
import { EquipmentQueryPage } from '../equipment-query/equipment-query';
import { RepairListPage } from '../repair-list/repair-list';
import { PlanListPage } from '../plan-list/plan-list';
import { PmListPage } from '../pm-list/pm-list';
import { WorkHistoryQueryPage } from '../work-history-query/work-history-query';
import { FactoryKpiPage } from '../factory-kpi/factory-kpi';
import { CompanyKpiPage } from '../company-kpi/company-kpi';
import { ContactPage } from '../contact/contact';
import { NoticeListPage } from '../notice-list/notice-list';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {Storage} from "@ionic/storage";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {RepairPage} from "../repair-list/repair/repair";
import {NoticePage} from "../notice-list/notice/notice";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;
  slidesItems:any=[];

  buttonshow:any=[];
  username:string="";
  e:boolean;
  u:boolean;
  token:any="";
  rmnoticeList:any=[];
  constructor(public navCtrl: NavController,public httpService:HttpServiceProvider,
              public config:ConfigServiceProvider,public storage:Storage,
              public nativeService:NativeServiceProvider,private events:Events) {
    this.storage.get("token").then((token)=>{
      this.token =token;
      this.getNoticeList();
    })

    this.storage.get("username").then((val)=>{
      this.username = val;
      if(!this.nativeService.isConnecting()){//没网络时
        this.e=false;
        this.u=false;
      }else {
        this.userView();
      }
    })
  }

  userView(){
    var url = this.config.url+"appUser/user/VcappScreens?username="+this.username;
    let body = "platform=ios&token="+this.token;
    this.httpService.post(url,body).subscribe((res)=>{
      let data = res.json();
      this.buttonshow = data['result'];
      console.log(this.buttonshow)
      this.u=true;
    })
  }

  getNoticeList(){
    var url = this.config.url + "appEvent/selectnoticeList";
    let body = "platform=ios&token="+this.token+"&row=3&page=1";
    this.httpService.post(url,body,false).subscribe((res)=>{
      let data = res.json();
      this.slidesItems = data['data']['rmnoticeList'];
      for(var i=0;i<this.slidesItems.length;i++){
        if(this.slidesItems[i]['notudfchar01']==null||this.slidesItems[i]['notudfchar01']==''){
          this.slidesItems.splice(i,1);
        }
      }
    })
  }

  gotoNotice(){
    let index = this.slides.realIndex;
    console.log("index:"+index)
    console.log(this.slidesItems[index]['not_code']);
    this.navCtrl.push(NoticePage,{
      notice:this.slidesItems[index]
    })
  }






  //解决切换其他页面回去轮播图不动问题
  ionViewWillEnter(){
    this.slides.autoplayDisableOnInteraction = false;

    /*if(this.nativeService.isMobile()){
      if(this.slidesItems.length>1){
        console.log("start")
        this.slides.startAutoplay();
      }
    }*/
  }
  ionViewDidEnter(){
    this.slides.startAutoplay();
  }
  ionViewDidLeave(){
    if(this.nativeService.isMobile()){
      this.slides.stopAutoplay();
    }
  }
  //监听停止自动播放事件，设置自动播放。
  autoPlay() {
    if(this.slidesItems.length>1){
      this.slides.startAutoplay();
    }
  }

  //跳转设备信息查询页面
  goToEquipmentQueryPage(){
    this.navCtrl.push(EquipmentQueryPage);
  }
  //跳转故障维修列表页面
  goToRepairListPage(){
    this.navCtrl.push(RepairListPage);
  }
  //跳转计划维修列表页面
  goToPlanListPage(){
    this.navCtrl.push(PlanListPage);
  }
  //跳转PM工单列表页面
  goToPmListPage(){
    this.navCtrl.push(PmListPage);
  }
  //跳转工作历史查询页面
  goToWorkHistoryQueryPage(){
    this.navCtrl.push(WorkHistoryQueryPage);
  }
  //跳转工厂工作统计页面
  goToFactoryKpiPage(){
    this.navCtrl.push(FactoryKpiPage);
  }
  //跳转公司工作统计页面
  goToCompanyKpiPage(){
    this.navCtrl.push(CompanyKpiPage);
  }
  //跳转我的页面
  goToContactPage(){
    this.navCtrl.push(ContactPage);
  }
  //跳转公告页面
  goToNoticeListPage(){
    this.navCtrl.push(NoticeListPage);
  }

  obj_code:any="";
  scan:any=[];
  goToRepairPage(){
    this.navCtrl.push('QrscannerPage').then(()=>{
      var _that = this;
      this.events.subscribe('qrscanner:result', data => {
        _that.obj_code = data;//截取扫描结果存入数组中
        if(_that.obj_code!=null&&_that.obj_code!=""&&_that.obj_code!="null"){
          var url = _that.config.url +"appEvent/selectObjectDetail";
          let body = "platform=ios&token="+_that.token+"&obj_code="+_that.obj_code;
          _that.httpService.post(url,body,false).subscribe((res)=>{
            let data = res.json();
            if(data['status']==0){
              _that.scan = data['data']['r5Object'];
              if(_that.scan==null){
                _that.nativeService.showToast("该设备不存在");
              }else {
                if(_that.scan['obj_code']!=null&&_that.scan['obj_code']!=""&&_that.scan['obj_code']!=undefined){
                  this.navCtrl.push(RepairPage,{
                    equiment:this.scan,
                    pageKey:'equimentquery'
                  });
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
}
