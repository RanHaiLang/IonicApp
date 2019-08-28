import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";

/**
 * Generated class for the RequircodeListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'requircode-list',
  templateUrl: 'requircode-list.html'
})
export class RequircodeListComponent {

  text: string;

  token:any="";
  requircodeList:any;
  url:string="";
  publicparams:any="";//公共参数
  constructor(public navCtrl: NavController, public navParams: NavParams,public config:ConfigServiceProvider,
                public httpService:HttpServiceProvider,public nativeService:NativeServiceProvider,
                public viewCtrl: ViewController) {
    this.token = this.navParams.get("token");
    this.url = this.navParams.get("url");
    this.text = this.navParams.get("text");
    this.publicparams = this.navParams.get("publicparams");
    console.log(this.token)
    this.getRequicode();
  }

  getRequicode(){
    var url = this.config.url+"appEvent/"+this.url;
    var body = "platform=ios&token="+this.token+"&param="+this.word;
    if(this.text=='问题'){
      body = body+"&obj_class="+this.publicparams
    }else if(this.text=='原因'){
      body = body+"&rqm_code="+this.publicparams
    }else if(this.text=='行动'){
      body = body+"&cau_code="+this.publicparams
    }
    this.httpService.post(url,body).subscribe((res)=>{
      let data = res.json();
      this.requircodeList = data['data']['codelist'];
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
      var url = this.config.url + "appEvent/"+this.url;
      var body = "platform=ios&token="+this.token+"&param="+this.word;
      if(this.text=='问题'){
        body = body+"&obj_class="+this.publicparams
      }else if(this.text=='原因'){
        body = body+"&rqm_code="+this.publicparams
      }else if(this.text=='行动'){
        body = body+"&cau_code="+this.publicparams
      }
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        this.requircodeList = data['codelist'];
        this.totalPage = data['pageInfo']['totalPage']
      })
    }
  }

  doRefresh(refresher){
    this.pageNum=1;
    var url = this.config.url+"appEvent/"+this.url;
    var body = "platform=ios&token="+this.token+"&param="+this.word;
    if(this.text=='问题'){
      body = body+"&obj_class="+this.publicparams
    }else if(this.text=='原因'){
      body = body+"&rqm_code="+this.publicparams
    }else if(this.text=='行动'){
      body = body+"&cau_code="+this.publicparams
    }
    setTimeout(() => {
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json()['data'];
        this.requircodeList = data['codelist'];
        this.totalPage = data['pageInfo']['totalPage']
      })
      refresher.complete();
    }, 2000);
  }
  //上拉加载
  doInfinite(infiniteScroll){
    if(this.totalPage>this.pageNum){
      this.pageNum+=1;
      var url = this.config.url + "appEvent/"+this.url;
      var body = "platform=ios&token="+this.token+"&param="+this.word+"&page="+this.pageNum+"&row=10";
      if(this.text=='问题'){
        body = body+"&obj_class="+this.publicparams
      }else if(this.text=='原因'){
        body = body+"&rqm_code="+this.publicparams
      }else if(this.text=='行动'){
        body = body+"&cau_code="+this.publicparams
      }
      setTimeout(() => {
        this.httpService.post(url,body).subscribe((res)=>{
          let data = res.json()['data'];
          this.totalPage = data['pageInfo']['totalPage']
          for(let i=0;i<data['codelist'].length;i++){
            this.requircodeList.push(data['codelist'][i])
          }
        })
        infiniteScroll.complete();
      }, 2000);
    }else {
      infiniteScroll.complete();
    }
  }

  dismiss(e){
    console.log("e:"+e);
    this.viewCtrl.dismiss(e);
  }

}
