import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Navbar} from 'ionic-angular';
import { RepairImplementPage } from '../repair-list/repair-implement/repair-implement';
import {Storage} from "@ionic/storage";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {PmImplementPage} from "../pm-list/pm-implement/pm-implement";
import {PlanImplementPage} from "../plan-list/plan-implement/plan-implement";
import {Keyboard} from "@ionic-native/keyboard";

/**
 * Generated class for the WorkHistoryQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-work-history-query',
  templateUrl: 'work-history-query.html',
})
export class WorkHistoryQueryPage {

  public doing:string="B130：";//维修中
  token:string="";
  username:string="";

  repairAll:any=[];
  evt_mrc:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public config:ConfigServiceProvider,
              public http:HttpServiceProvider,public nativeService:NativeServiceProvider,public sotrage:Storage,private keyboard: Keyboard) {
    this.sotrage.get("token").then((token)=>{
      this.token =token;
      this.sotrage.get("username").then((username)=>{
        this.username = username;
        this.sotrage.get("usr_mrc").then((usr_mrc)=>{
          this.evt_mrc = usr_mrc;
          this.getEventsList();
        })

      })

    })
  }

  //获取维修列表
  getEventsList(){
    var url =this.config.url + "appEvent/selectAppR5EventAll";
    let body = "platform=ios&token="+this.token+"&username="+this.username+"&evt_mrc="+this.evt_mrc;
    this.http.post(url,body).subscribe((res)=>{
      let data = res.json();
      for(var i=0;i<data['data']['eventlist'].length;i++){
        data['data']['eventlist'][i]['evt_reported'] = data['data']['eventlist'][i]['evt_reported'].replace(/-/g,'/');
      }
      this.repairAll = data['data']['eventlist'];
      this.totalPage = data['data']['pageInfo']['totalPage'];
    })
  }

  //搜索
  word:string="";//搜索条件
  pageNum:number=1;//当前页默认1
  totalPage:number;//总页数
  //搜索
  getItems(item){
    if("Enter"==item.key){
      this.pageNum=1;
      if(item.target.value!=undefined){
        this.word=item.target.value;
      }else {
        this.word="";
      }
      var url = this.config.url + "appEvent/selectAppR5EventAll";
      var body = "platform=ios&token="+this.token+"&username="+this.username+"&param="+this.word+"&evt_mrc="+this.evt_mrc;
      this.http.post(url,body).subscribe((res)=>{
        let data = res.json();
        for(var i=0;i<data['data']['eventlist'].length;i++){
          data['data']['eventlist'][i]['evt_reported'] = data['data']['eventlist'][i]['evt_reported'].replace(/-/g,'/');
        }
        this.repairAll = data['data']['eventlist'];
        this.totalPage = data['data']['pageInfo']['totalPage'];
      })
    }
  }
  //下拉刷新
  doRefresh(refresher){
    //this.keyboard.show();
    this.pageNum=1;
    var url = this.config.url+"appEvent/selectAppR5EventAll";
    var body = "platform=ios&token="+this.token+"&username="+this.username+"&param="+this.word+"&evt_mrc="+this.evt_mrc;
    setTimeout(() => {
      this.http.post(url,body).subscribe((res)=>{
        let data = res.json();
        for(var i=0;i<data['data']['eventlist'].length;i++){
          data['data']['eventlist'][i]['evt_reported'] = data['data']['eventlist'][i]['evt_reported'].replace(/-/g,'/');
        }
        this.repairAll = data['data']['eventlist'];
        this.totalPage = data['data']['pageInfo']['totalPage'];
      })
      refresher.complete();
    }, 2000);
  }

  //上拉加载
  doInfinite(infiniteScroll){
    console.log("上拉"+this.totalPage+":"+this.pageNum);
    if(this.totalPage>this.pageNum){
      this.pageNum+=1;
      var url = this.config.url + "appEvent/selectAppR5EventAll";
      var body = "platform=ios&token="+this.token+"&username="+this.username+"&param="+this.word+"&page="+this.pageNum+"&row=1&evt_mrc="+this.evt_mrc;
      setTimeout(() => {
        this.http.post(url,body).subscribe((res)=>{
          let data = res.json();
          for(var i=0;i<data['data']['eventlist'].length;i++){
            data['data']['eventlist'][i]['evt_reported'] = data['data']['eventlist'][i]['evt_reported'].replace(/-/g,'/');
          }
          this.totalPage = data['data']['pageInfo']['totalPage']
          for(let i=0;i<data['data']['eventlist'].length;i++){
            this.repairAll.push(data['data']['eventlist'][i])
          }
        })
        infiniteScroll.complete();
      }, 2000);
    }else {
      infiniteScroll.complete();
    }
  }
  @ViewChild(Navbar) navBar: Navbar;
  backButtonClick():void{
    this.navCtrl.popToRoot();
  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  //跳转维修单页面
  goToImplementPage(item){
    console.log(item.evt_class)
    if(item.evt_class=='JS13'){//故障
      this.navCtrl.push(RepairImplementPage,{
        evt_code:item.evt_code,
        keyPage:'history'
      });
    }else if(item.evt_class=='JS14'){//PM
      this.navCtrl.push(PmImplementPage,{
        evt_code:item.evt_code,
        keyPage:'history'
      });
    }else if(item.evt_class=='JS15'){//计划
      this.navCtrl.push(PlanImplementPage,{
        evt_code:item.evt_code,
        keyPage:'history'
      });
    }
  }
}


export class Item{
  constructor(
    public code:string,
    public name:string,
    public time:string,
    public describe:string,
    public equipment:string,
    public model:string,
    public workshop:string,
    public region:string,
    public position:string,
    public person:string,
    public state:string
  ){

  }
}
