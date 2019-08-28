import { Component } from '@angular/core';
import {ViewController, NavParams, NavController} from "ionic-angular";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";

/**
 * Generated class for the ProjectbudgetListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'projectbudget-list',
  templateUrl: 'projectbudget-list.html'
})
export class ProjectbudgetListComponent {

  token:any="";
  projectbudgetList:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public config:ConfigServiceProvider,
              public httpService:HttpServiceProvider,public nativeService:NativeServiceProvider,
              public viewCtrl: ViewController) {
    this.token = this.navParams.get("token");
    this.getRequicode();
  }


  getRequicode(){
    var url = this.config.url+"appEvent/searchproejct";
    var body = "platform=ios&token="+this.token+"&param=";
    this.httpService.post(url,body).subscribe((res)=>{
      let data = res.json();
      this.projectbudgetList = data['data']['projectbudgetlist'];
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
      var url = this.config.url + "appEvent/searchproejct";
      var body = "platform=ios&token="+this.token+"&param="+this.word;
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        this.projectbudgetList = data['projectbudgetlist'];
        this.totalPage = data['pageInfo']['totalPage']
      })
    }
  }

  doRefresh(refresher){
    this.pageNum=1;
    var url = this.config.url+"appEvent/searchproejct";
    var body = "platform=ios&token="+this.token+"&param="+this.word;
    setTimeout(() => {
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        this.projectbudgetList = data['projectbudgetlist'];
        this.totalPage = data['pageInfo']['totalPage']
      })
      refresher.complete();
    }, 2000);
  }
  //上拉加载
  doInfinite(infiniteScroll){
    if(this.totalPage>this.pageNum){
      this.pageNum+=1;
      var url = this.config.url + "appEvent/searchproejct";
      var body = "platform=ios&token="+this.token+"&param="+this.word+"&page="+this.pageNum+"&row=10";
      setTimeout(() => {
        this.httpService.post(url,body).subscribe((res)=>{
          let data = res.json()['data'];
          this.totalPage = data['pageInfo']['totalPage']
          for(let i=0;i<data['projectbudgetlist'].length;i++){
            this.projectbudgetList.push(data['projectbudgetlist'][i])
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
