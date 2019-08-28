import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";

/**
 * Generated class for the SelectuserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-selectuser',
  templateUrl: 'selectuser.html',
})
export class SelectuserPage {

  userList:any=[];
  evt_code:string;
  f:boolean=false;
  token:any;
  url:string="selectuser";//员工
  usr_group:string="";
  usr_mrc:string="";
  pageKey:string="";
  username:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public httpService:HttpServiceProvider,public storage:Storage,
              public viewCtrl:ViewController,public config:ConfigServiceProvider) {
    this.pageKey = this.navParams.get("pageKey");
    this.usr_group = this.navParams.get("usr_group")==undefined?"":this.navParams.get("usr_group");
    this.usr_mrc = this.navParams.get("usr_mrc")==undefined?"":this.navParams.get("usr_mrc");
    this.url = this.navParams.get("url")==undefined?this.url:this.navParams.get("url");
    this.storage.get("username").then((username)=>{
      this.username = username;
    })
    this.storage.get("token").then((token)=>{
      this.token = token;
      this.getUser();
    })

  }

  getUser(){
    var url = this.config.url + "appEvent/"+this.url;
    let body = "platform=ios&token="+this.token+"&usr_group="+this.usr_group+"&usr_mrc="+this.usr_mrc+"&username="+this.username;
    this.httpService.post(url,body).subscribe((res)=>{
      let data = res.json();
      this.userList = data['data']['userlist'];
      if(this.pageKey=='repairlist'){
        for(var i=0;i<this.userList.length;i++){
          this.userList[i]['per_code']=this.userList[i]['usr_code'];
          this.userList[i]['per_desc']=this.userList[i]['usr_desc'];
        }
      }
      this.totalPage = data['data']['pageInfo']['totalPage'];
    })
  }

  //搜索
  pageNum:number=1;//当前页默认1
  totalPage:number;//总页数
  word:string="";
  getItems(item){
    if("Enter"==item.key){
      this.f = false;
      this.pageNum=1;
      if(item.target.value!=undefined){
        this.word=item.target.value;
      }else {
        this.word="";
      }
      var url = this.config.url + "appEvent/"+this.url;
      let body = "platform=ios&token="+this.token+"&param="+this.word+"&usr_group="+this.usr_group+"&usr_mrc="+this.usr_mrc+"&username="+this.username;
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json();
        this.userList = data['data']['userlist']
        if(this.pageKey=='repairlist'){
          for(var i=0;i<this.userList.length;i++){
            this.userList[i]['per_code']=this.userList[i]['usr_code'];
            this.userList[i]['per_desc']=this.userList[i]['usr_desc'];
          }
        }
        this.totalPage = data['data']['pageInfo']['totalPage'];
      })
    }
  }

  //下拉刷新
  doRefresh(refresher){
    this.pageNum=1;
    var url = this.config.url + "appEvent/"+this.url;
    let body = "platform=ios&token="+this.token+"&param="+this.word+"&usr_group="+this.usr_group+"&usr_mrc="+this.usr_mrc+"&username="+this.username;
    setTimeout(() => {
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json();
        this.userList = data['data']['userlist']
        if(this.pageKey=='repairlist'){
          for(var i=0;i<this.userList.length;i++){
            this.userList[i]['per_code']=this.userList[i]['usr_code'];
            this.userList[i]['per_desc']=this.userList[i]['usr_desc'];
          }
        }
        this.totalPage = data['data']['pageInfo']['totalPage'];
      })
      this.f = false;
      refresher.complete();
    }, 2000);
  }

  //上拉加载
  doInfinite(infiniteScroll){
    if(this.totalPage>this.pageNum){
      this.pageNum+=1;
      var url = this.config.url + "appEvent/"+this.url;
      let body = "platform=ios&token="+this.token+"&param="+this.word+"&pageNum="+this.pageNum+"&usr_group="+this.usr_group+"&usr_mrc="+this.usr_mrc+"&username="+this.username;
      setTimeout(() => {
        this.httpService.post(url,body).subscribe((res)=>{
          let data = res.json();
          this.totalPage = data['data']['pageInfo']['totalPage'];
          for(let i=0;i<data['data']['userlist'].length;i++){
            if(this.pageKey=='repairlist'){
              data['data']['userlist'][i]['per_code']=data['data']['userlist'][i]['usr_code'];
              data['data']['userlist'][i]['per_desc']=data['data']['userlist'][i]['usr_desc'];
            }
            this.userList.push(data['data']['userlist'][i])
          }
        })
        infiniteScroll.complete();
      }, 2000);
    }else {
      this.f = true;
      infiniteScroll.complete();
    }
  }

  dismiss(y){
    this.viewCtrl.dismiss(y);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectuserPage');
  }

}
