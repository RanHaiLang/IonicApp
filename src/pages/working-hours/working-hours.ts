import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import {SelectuserPage} from "../../components/selectuser/selectuser";
import {Storage} from "@ionic/storage";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {RepairImplementPage} from "../repair-list/repair-implement/repair-implement";
import {PlanImplementPage} from "../plan-list/plan-implement/plan-implement";
import {PmImplementPage} from "../pm-list/pm-implement/pm-implement";

/**
 * Generated class for the WorkingHoursPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-working-hours',
  templateUrl: 'working-hours.html',
})
export class WorkingHoursPage {

  token:any;
  workhour:any=[];
  boo_event:any;
  pageKey:any;
  username:any="";
  uname:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public modalCtrl: ModalController,public storage:Storage,
              public httpService:HttpServiceProvider,public config:ConfigServiceProvider,
              public nativeService:NativeServiceProvider) {
      this.storage.get("token").then((token)=>{
        this.token = token;
      })
      this.storage.get("name").then((name)=>{
        this.uname = name;
        this.workhour['boo_person_desc'] = this.uname;
        console.log(this.workhour['boo_person_desc']);
      })
      this.storage.get("username").then((username)=>{
        this.username = username;
        this.workhour['boo_person'] = this.username;
      })
      this.boo_event = this.navParams.get("evt_code");
      this.pageKey = this.navParams.get("pageKey");
      this.workhour.boo_date = this.nativeService.dateFormat(new Date(),'yyyy-MM-dd');
      this.workhour.boo_on = this.nativeService.dateFormat(new Date(),'HH:mm');
      this.workhour.boo_off = this.nativeService.dateFormat(new Date(),'HH:mm');
      this.workhour.boo_hours = 0;
      console.log(this.workhour.boo_date);
  }

  //用户列表弹框
  goRequirList(key,text){
    let modal = this.modalCtrl.create(SelectuserPage);
    modal.onDidDismiss(data=>{
      if(data!=null&&data!=""){
        this.workhour['boo_person'] = data['per_code'];
        this.workhour['boo_person_desc'] = data['per_desc'];
        this.workhour['boo_mrc'] = data['per_mrc'];
      }
    });
    modal.present();
  }

  //维修时长计算
  getBooHours(){
    if(this.workhour['boo_on']==null||this.workhour['boo_on']==""){
      this.nativeService.showToast("请选择开始时间");
    }else{
      if(this.workhour['boo_off']!=null&&this.workhour['boo_off']!=""){
        var on = new Date(("2018-11-23 "+this.workhour['boo_on']+":00"));
        var off = new Date(("2018-11-23 "+this.workhour['boo_off']+":00"));
        if(on>off){
          this.nativeService.showToast("开始时间不能早于结束时间");
        }else {
          var newDate = off.getTime()-on.getTime();//毫秒
          //向下取整floor,向上取整ceil Math.floor()
          this.workhour['boo_hours']=(newDate/1000/60/60).toFixed(2);//保留两位小数四舍五入
        }
      }
    }
  }

  //保存
  saveWorkHour(){
    if(this.workhour['boo_person']==null||this.workhour['boo_person']==""){
      this.nativeService.showToast("请选择姓名");
    }else if(this.workhour['boo_date']==null||this.workhour['boo_date']==""){
      this.nativeService.showToast("请选择工作日期");
    }else if(this.workhour['boo_on']==null||this.workhour['boo_on']==""){
      this.nativeService.showToast("请选择开始时间");
    }else if(this.workhour['boo_off']==null||this.workhour['boo_off']==""){
      this.nativeService.showToast("请选择结束时间");
    }else {
      var on = new Date(("2018-11-23 "+this.workhour['boo_on']+":00"));
      var off = new Date(("2018-11-23 "+this.workhour['boo_off']+":00"));
      if(on>off){
        this.nativeService.showToast("开始时间不能早于结束时间");
      }else {
        var url = this.config.url +"appEvent/insertbook"

        var hour_on = this.workhour['boo_on'].split(':')[0];
        var min_on = this.workhour['boo_on'].split(':')[1];
        var boo_on = Number(hour_on*3600) + Number(min_on*60);//将时分转成成秒
        var hour_off = this.workhour['boo_off'].split(':')[0];
        var min_off = this.workhour['boo_off'].split(':')[1];
        var boo_off = Number(hour_off*3600) + Number(min_off*60);//将时分转成成秒

        if(this.workhour['boo_hours']==0){
            this.nativeService.showToast("维修时长不能为0")
        }else {
          let body = "platform=ios&token=" + this.token + "&boo_event=" + this.boo_event
            + "&boo_person=" + this.workhour['boo_person'] + "&boo_on=" + boo_on
            + "&boo_off=" + boo_off + "&boo_hours=" + this.workhour['boo_hours']
            + "&boo_act=1&boo_date=" + this.workhour['boo_date'];
          this.httpService.post(url, body).subscribe((res) => {
            let data = res.json();
            this.nativeService.showToast(data['data']);
            if (data['status'] == 0) {//工时登记成功
              /*if (this.pageKey == 'repair') {
                this.dismiss(this.boo_event);
              } else if (this.pageKey == 'plan') {
                this.dismiss(this.boo_event);
              } else if (this.pageKey == 'pm') {
                this.dismiss(this.boo_event);
              } else {
                this.navCtrl.pop();
              }*/
              this.dismiss(this.boo_event);
            }
          })
        }
      }
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkingHoursPage');
  }
  dismiss(evt_code){
    this.viewCtrl.dismiss(evt_code);
  }
}
