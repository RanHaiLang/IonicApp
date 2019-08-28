import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Navbar, AlertController, ModalController} from 'ionic-angular';
import { PlanImplementPage } from './plan-implement/plan-implement';
import { RepairPage } from '../repair-list/repair/repair';
import {Storage} from "@ionic/storage";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {SelectuserPage} from "../../components/selectuser/selectuser";
import {HomePage} from "../home/home";

/**
 * Generated class for the PlanListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-plan-list',
  templateUrl: 'plan-list.html',
})
export class PlanListPage {
  //默认显示所有故障维修
  repair: string ="all";

  public doing:string="B140：";//接单执行
  public red:string="B150";//维修延期
  token:string="";
  username:string="";
  usr_mrc:string="";
  usr_group:string="";

  repairAll:any=[];
  repairWait:any=[];
  repairDelay:any=[];
  repairMy:any=[];

  allcount:any;//所有
  totalPage:number;//所有的总页数
  pageNum:number=1;//当前页默认1
  delaycount:any;//延迟
  delayTotalPage:any;
  waitcount:any;//待接单
  waitTotalPage:any;
  mycount:any;//我的
  myTotalPage:any;

  word:string="";//搜索条件
  usrudfchar06:any="";//转接单权限

  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController, public navParams: NavParams,public config:ConfigServiceProvider,
              public http:HttpServiceProvider,public nativeService:NativeServiceProvider,public sotrage:Storage,
              public modalCtrl: ModalController,private alertCtrl:AlertController) {
    this.sotrage.get("usr_mrc").then((usr_mrc)=>{
      this.usr_mrc = usr_mrc;
    })
    this.sotrage.get("usr_group").then((usr_group)=>{
      this.usr_group = usr_group;
    })
    this.sotrage.get("usrudfchar06").then((usrudfchar06)=>{
      this.usrudfchar06 = usrudfchar06;
    })
    this.sotrage.get("token").then((token)=>{
      this.token =token;
      this.sotrage.get("username").then((username)=>{
        this.username = username;
        this.getPlanImplementList();
      })
    })
  }

  //获取计划维修列表
  getPlanImplementList(){
    var url =this.config.url + "appEvent/selectAppR5Event";
    let body = "platform=ios&token="+this.token+"&username="+this.username+"&evt_class=JS15&evt_mrc="+this.usr_mrc;
    if(this.repair=='pending'){//待接单
      body = body+"&evt_status=B110";
    }
    if(this.repair == 'delay'){//延迟
      body = body+"&evt_status=B150";
    }
    if(this.repair=='mine'){
      body = body +"&evt_udfchar08="+this.username+"&evt_enteredby="+this.username
    }
    this.http.post(url,body).subscribe((res)=>{
      let data = res.json()['data'];
      for(var i=0;i<data['eventlist'].length;i++){
        data['eventlist'][i]['evt_reported'] = data['eventlist'][i]['evt_reported'].replace(/-/g,'/');
        data['eventlist'][i]['evt_workaddress'] = data['eventlist'][i]['evt_workaddress'].substring(0,25);
        console.log(data['eventlist'][i]['evt_workaddress'])
      }
      if(this.repair=='pending'){//待接单
        this.repairWait = data['eventlist'];
        this.waitTotalPage = data['pageInfo']['totalPage'];
      }else if(this.repair=='delay'){//延迟
        this.repairDelay = data['eventlist'];
        this.delayTotalPage = data['pageInfo']['totalPage'];
      }else if(this.repair=='mine'){//我的
        this.repairMy = data['eventlist'];
        this.myTotalPage = data['pageInfo']['totalPage'];
      }else {//所有
        this.repairAll = data['eventlist'];
        this.totalPage = data['pageInfo']['totalPage'];
        this.allcount = data['allcount'];
        this.waitcount = data['waitcount'];
        this.delaycount = data['delaycount'];
        this.mycount = data['mycount'];
        console.log(this.mycount)
      }

    })
  }

  //下拉刷新
  doRefresh(refresher){
    this.pageNum=1;
    var url = this.config.url+"appEvent/selectAppR5Event";
    var body = "platform=ios&token="+this.token+"&username="+this.username+"&param="+this.word+"&evt_class=JS15&evt_mrc="+this.usr_mrc;

    if(this.repair=='pending'){//待接单
      body = body+"&evt_status=B110";
    }
    if(this.repair == 'delay'){//延迟
      body = body+"&evt_status=B150";
    }
    if(this.repair=='mine'){
      body = body +"&evt_udfchar08="+this.username+"&evt_enteredby="+this.username
    }

    setTimeout(() => {
      this.http.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        for(var i=0;i<data['eventlist'].length;i++){
          data['eventlist'][i]['evt_reported'] = data['eventlist'][i]['evt_reported'].replace(/-/g,'/');
          data['eventlist'][i]['evt_workaddress'] = data['eventlist'][i]['evt_workaddress'].substring(0,25);
        }
        if(this.repair=='pending'){//待接单
          this.repairWait = data['eventlist'];
          this.waitTotalPage = data['pageInfo']['totalPage'];
        }else if(this.repair=='delay'){//延迟
          this.repairDelay = data['eventlist'];
          this.delayTotalPage = data['pageInfo']['totalPage'];
        }else if(this.repair=='mine'){//我的
          this.repairMy = data['eventlist'];
          this.myTotalPage = data['pageInfo']['totalPage'];
        }else {//所有
          this.repairAll = data['eventlist'];
          this.totalPage = data['pageInfo']['totalPage'];
          this.allcount = data['allcount'];
          this.waitcount = data['waitcount'];
          this.delaycount = data['delaycount'];
          this.mycount = data['mycount'];
          console.log(this.mycount)
        }
      })
      refresher.complete();
    }, 2000);
  }

  //上拉加载
  doInfinite(infiniteScroll){
    var url = this.config.url + "appEvent/selectAppR5Event";
    var body = "platform=ios&token="+this.token+"&username="+this.username+"&param="+this.word+"&row=10&evt_class=JS15&evt_mrc="+this.usr_mrc;
    if(this.repair=='pending'){//待接单
      if(this.waitTotalPage>this.pageNum){
        this.pageNum+=1;
        body = body+"&evt_status=B110&page="+this.pageNum;
        this.Infinite(infiniteScroll,url,body)
      }else {
        infiniteScroll.complete();
      }
    }else if(this.repair == 'delay'){//延迟
      if(this.delayTotalPage>this.pageNum){
        this.pageNum+=1;
        body = body+"&evt_status=B150&page="+this.pageNum;
        this.Infinite(infiniteScroll,url,body)
      }else {
        infiniteScroll.complete();
      }
    }else if(this.repair=='mine'){
      if(this.myTotalPage>this.pageNum){
        this.pageNum+=1;
        body = body+"&evt_udfchar08="+this.username+"&page="+this.pageNum+"&evt_enteredby="+this.username;
        this.Infinite(infiniteScroll,url,body)
      }else {
        infiniteScroll.complete();
      }
    }else {
      if(this.totalPage>this.pageNum){
        this.pageNum+=1;
        body = body +"&page="+this.pageNum;
        this.Infinite(infiniteScroll,url,body)
      }else {
        infiniteScroll.complete();
      }
    }
  }

  Infinite(infiniteScroll,url,body){
    setTimeout(() => {
      this.http.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        for(var i=0;i<data['eventlist'].length;i++){
          data['eventlist'][i]['evt_reported'] = data['eventlist'][i]['evt_reported'].replace(/-/g,'/');
          data['eventlist'][i]['evt_workaddress'] = data['eventlist'][i]['evt_workaddress'].substring(0,25);
        }
        if(this.repair=='pending'){//待接单
          this.waitTotalPage = data['pageInfo']['totalPage']
          for(let i=0;i<data['eventlist'].length;i++){
            this.repairWait.push(data['eventlist'][i])
          }
        }else if(this.repair == 'delay'){//延迟
          this.delayTotalPage = data['pageInfo']['totalPage']
          for(let i=0;i<data['eventlist'].length;i++){
            this.repairDelay.push(data['eventlist'][i])
          }
        }else if(this.repair=='mine'){
          this.myTotalPage = data['pageInfo']['totalPage']
          for(let i=0;i<data['eventlist'].length;i++){
            this.repairMy.push(data['eventlist'][i])
          }
        }else {
          this.totalPage = data['pageInfo']['totalPage']
          for(let i=0;i<data['eventlist'].length;i++){
            this.repairAll.push(data['eventlist'][i])
          }
        }
      })
      infiniteScroll.complete();
    }, 2000);
  }

  //接单
  updateEventStatus(item){
    const confirm = this.alertCtrl.create({
      title: '操作提示',
      message: '确认接单？',
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
            var url = this.config.url +"appEvent/updateR5event";
            let body = "platform=ios&token="+this.token+"&evt_code="+item.evt_code+"&evt_status=B140&oldStatus="+item.evt_status+"&username="+this.username;
            this.http.post(url,body).subscribe((res)=>{
              let data = res.json();
              if(data['status']==0){
                this.nativeService.showToast("接单成功");
                this.getPlanImplementList();
              }else {
                this.nativeService.showToast(data['data']);
              }
            })
          }
        }
      ]
    });
    confirm.present();
  }

  //转单
  ChangeOrder(item){
    let modal = this.modalCtrl.create(SelectuserPage,{
      url:'SelectEamUser',
      usr_group:this.usr_group,//用户组,
      usr_mrc:this.usr_mrc,
      pageKey:'repairlist'
    });
    modal.onDidDismiss(data=>{
      if(data!=null&&data!=""){
        const confirm = this.alertCtrl.create({
          title: '操作提示',
          message: '确认转单给'+data['per_desc'],
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
                var url = this.config.url +"appEvent/updateUdfchar08";
                let body = "platform=ios&token="+this.token+"&evt_code="+item.evt_code+"&evt_udfchar08="+data['per_code'];
                this.http.post(url,body).subscribe((res)=>{
                  let data = res.json();
                  this.nativeService.showToast(data['data']);
                  if(data['status']==0){
                    this.getPlanImplementList();
                  }
                })
              }
            }
          ]
        });
        confirm.present();
      }
    });
    modal.present();
  }

  backButtonClick():void{
    this.navCtrl.setRoot(HomePage);
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }

  goToRepairPage(){
    this.navCtrl.push(RepairPage);
  }
  //跳转计划维修单页面
  goToPlanImplementPage(item){
    this.navCtrl.push(PlanImplementPage,{
      evt_code:item.evt_code
    });
  }

}


export class Item{
  constructor(

  ){

  }
}
