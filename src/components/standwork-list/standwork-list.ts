import { Component } from '@angular/core';
import {ViewController, NavParams, NavController} from "ionic-angular";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";

/**
 * Generated class for the StandworkListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'standwork-list',
  templateUrl: 'standwork-list.html'
})
export class StandworkListComponent {

  text: string;

  token:any="";
  standworkList:any;
  stw_class:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public config:ConfigServiceProvider,
              public httpService:HttpServiceProvider,public nativeService:NativeServiceProvider,
              public viewCtrl: ViewController) {
    this.token = this.navParams.get("token");
    this.stw_class = this.navParams.get("stw_class")
    this.getRequicode();
  }

  getRequicode(){
    var url = this.config.url+"appEvent/searchstandwork";
    var body = "platform=ios&token="+this.token+"&param=&stw_woclass="+this.stw_class;
    this.httpService.post(url,body).subscribe((res)=>{
      let data = res.json();
      this.standworkList = data['data']['worklist'];
      this.totalPage = data['data']['pageInfo']['totalPage']
    })
  }

  //搜索
  word:string="";//搜索条件
  pageNum:number=1;//当前页默认1
  totalPage:number;//总页数
  getItems(item){
    if("Enter"==item.key){
      this.pageNum=1;
      if(item.target.value!=undefined){
        this.word=item.target.value;
      }else {
        this.word="";
      }
      var url = this.config.url + "appEvent/searchstandwork";
      var body = "platform=ios&token="+this.token+"&param="+this.word+"&stw_woclass="+this.stw_class;
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        this.standworkList = data['data']['worklist'];
        this.totalPage = data['pageInfo']['totalPage']
      })
    }
  }

  doRefresh(refresher){
    this.pageNum=1;
    var url = this.config.url+"appEvent/searchstandwork";
    var body = "platform=ios&token="+this.token+"&param="+this.word+"&stw_woclass="+this.stw_class;
    setTimeout(() => {
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        this.standworkList = data['data']['worklist'];
        this.totalPage = data['pageInfo']['totalPage']
      })
      refresher.complete();
    }, 2000);
  }
  //上拉加载
  doInfinite(infiniteScroll){
    if(this.totalPage>this.pageNum){
      this.pageNum+=1;
      var url = this.config.url + "appEvent/searchstandwork";
      var body = "platform=ios&token="+this.token+"&param="+this.word+"&page="+this.pageNum+"&row=10&stw_woclass="+this.stw_class;
      setTimeout(() => {
        this.httpService.post(url,body).subscribe((res)=>{
          let data = res.json()['data'];
          this.totalPage = data['pageInfo']['totalPage']
          for(let i=0;i<data['worklist'].length;i++){
            this.standworkList.push(data['worklist'][i])
          }
        })
        infiniteScroll.complete();
      }, 2000);
    }else {
      infiniteScroll.complete();
    }
  }

  dismiss(e){
    this.viewCtrl.dismiss(e);
  }

}
