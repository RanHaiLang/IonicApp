import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NoticePage } from './notice/notice';
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the NoticeListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notice-list',
  templateUrl: 'notice-list.html',
})
export class NoticeListPage {

  token:any="";
  rmnoticeList:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public http:HttpServiceProvider,
              public config:ConfigServiceProvider,
              public native:NativeServiceProvider,
              public storage:Storage) {
    this.storage.get("token").then((token)=>{
      this.token = token;
      this.getNoticeList();
    })
  }


  getNoticeList(){
    var url = this.config.url + "appEvent/selectnoticeList";
    let body = "platform=ios&token="+this.token;
    this.http.post(url,body).subscribe((res)=>{
      let data = res.json();
      this.rmnoticeList = data['data']['rmnoticeList'];
      this.totalPage = data['data']['pageInfo']['totalPage']
      for(var i=0;i<this.rmnoticeList.length;i++){
        this.rmnoticeList[i]['notudfchar02'] = "url("+this.rmnoticeList[i]['notudfchar02']+")"
      }
      console.log(this.rmnoticeList);
    })
  }

  //搜索
  word:string="";//搜索条件
  pageNum:number=1;//当前页默认1
  totalPage:number;//总页数

  //下拉刷新
  doRefresh(refresher){
    this.pageNum=1;
    var url = this.config.url+"appEvent/selectnoticeList";
    var body = "platform=ios&token="+this.token;
    setTimeout(() => {
      this.http.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        this.rmnoticeList = data['rmnoticeList'];
        for(var i=0;i<this.rmnoticeList.length;i++){
          this.rmnoticeList[i]['notudfchar02'] = "url("+this.rmnoticeList[i]['notudfchar02']+")"
        }
        this.totalPage = data['pageInfo']['totalPage']
      })
      refresher.complete();
    }, 2000);
  }
  //上拉加载
  doInfinite(infiniteScroll){
    if(this.totalPage>this.pageNum){
      this.pageNum+=1;
      var url = this.config.url + "appEvent/selectnoticeList";
      var body = "platform=ios&token="+this.token+"&page="+this.pageNum+"&row=10";
      setTimeout(() => {
        this.http.post(url,body).subscribe((res)=>{
          let data = res.json()['data'];
          this.totalPage = data['pageInfo']['totalPage']
          for(let i=0;i<data['rmnoticeList'].length;i++){
            data['rmnoticeList'][i]['notudfchar02'] =  "url("+data['rmnoticeList'][i]['notudfchar02']+")"
            this.rmnoticeList.push(data['rmnoticeList'][i])
          }
        })
        infiniteScroll.complete();
      }, 2000);
    }else {
      infiniteScroll.complete();
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeListPage');
  }
  //跳转公告页面
  goToNoticePage(item){
    this.navCtrl.push(NoticePage,{
      notice:item
    });
  }
}

export class Item{
  constructor(
    public img: string,
    public title: string,
    public time:string
  ){

  }
}
