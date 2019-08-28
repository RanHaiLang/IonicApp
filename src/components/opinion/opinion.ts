import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {HttpServiceProvider} from "../../providers/http-service/http-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {ConfigServiceProvider} from "../../providers/config-service/config-service";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the OpinionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'opinion',
  templateUrl: 'opinion.html'
})
export class OpinionComponent {

  username:string;
  opinion:string="";
  code:string;
  token:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,
              public httpService:HttpServiceProvider,public storage:Storage,public nativeService:NativeServiceProvider,
              public config:ConfigServiceProvider) {
    this.code = this.navParams.get("evt_code");
    this.storage.get("username").then((res)=>{
      this.username = res;
    })
    this.storage.get("token").then((token)=>{
      this.token = token;
    })
  }

  dismiss(){
    this.viewCtrl.dismiss(0);
  }

  submitOpinion(){
    if(this.opinion==""){
      this.nativeService.showToast("请填写取消理由！")
    }else {
      var url = this.config.url + "appEvent/insertevtadd";
      let body = "platform=ios&token="+this.token+"&add_user="+this.username+"&add_text="+this.opinion+"&add_code="+this.code;
      this.httpService.post(url,body).subscribe((res)=>{
        let data = res.json()
        if(data['resultCode']==1){
          this.viewCtrl.dismiss(1);
        }else {
          this.nativeService.showToast(data['message']);
        }
      })
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OpinionPage');
  }

}
