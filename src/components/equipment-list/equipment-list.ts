import { Component } from '@angular/core';
import {IonicPage, ModalController, NavParams, NavController, ViewController} from "ionic-angular";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the EquipmentListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'equipment-list',
  templateUrl: 'equipment-list.html'
})
export class EquipmentListComponent {

  text: string;
  token:any="";
  equipmentList:any;
  username:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public config:ConfigServiceProvider,
              public httpService:HttpServiceProvider,public nativeService:NativeServiceProvider,
              public viewCtrl: ViewController,private storage:Storage) {
      this.token = this.navParams.get("token");
      this.storage.get("username").then((username)=>{
        this.username = username;
        console.log(username)
        this.getEquimpent();
      })

  }

  getEquimpent(){
    var url = this.config.url+"appEvent/searchAppR5Object";
    var body = "platform=ios&token="+this.token+"&username="+this.username+"&param="+this.word;
    this.httpService.post(url,body).subscribe((res)=>{
      let data = res.json();
      this.equipmentList = data['data']['r5ObjectList'];
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
      var url = this.config.url + "appEvent/searchAppR5Object"
      var body = "platform=ios&token="+this.token+"&param="+this.word+"&username="+this.username;
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        this.equipmentList = data['r5ObjectList'];
        this.totalPage = data['pageInfo']['totalPage']
      })
    }
  }

  doRefresh(refresher){
    this.pageNum=1;
    var url = this.config.url+"appEvent/searchAppR5Object";
    var body = "platform=ios&token="+this.token+"&param="+this.word+"&username="+this.username;
    setTimeout(() => {
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        this.equipmentList = data['r5ObjectList'];
        this.totalPage = data['pageInfo']['totalPage']
      })
      refresher.complete();
    }, 2000);
  }
  //上拉加载
  doInfinite(infiniteScroll){
    if(this.totalPage>this.pageNum){
      this.pageNum+=1;
      var url = this.config.url + "appEvent/searchAppR5Object";
      var body = "platform=ios&token="+this.token+"&param="+this.word+"&page="+this.pageNum+"&row=10&username="+this.username;
      setTimeout(() => {
        this.httpService.post(url,body).subscribe((res)=>{
          let data = res.json()['data'];
          this.totalPage = data['pageInfo']['totalPage']
          for(let i=0;i<data['r5ObjectList'].length;i++){
            this.equipmentList.push(data['r5ObjectList'][i])
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
