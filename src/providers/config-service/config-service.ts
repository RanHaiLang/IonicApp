import { Injectable } from '@angular/core';

/*
  Generated class for the ConfigServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigServiceProvider {

  //正式环境
  //url:any="https://eamapp.aux-home.com/AuxEam/"
  //测试环境
  //url:any="http://120.27.220.126:8880/AuxEam/"
  //本地环境
  url:any="http://192.168.3.124/AuxEam/";
  //开发环境
  //url:any="http://47.99.163.40:8880/AuxEam/";
  localurl:any="https://eamapp.aux-home.com/AuxWechat/";
  //localurl:any="http://192.168.3.128/AuxWechat/";
  public curreentversion="1.4.0";

  //测试key：4f2da8327319803564aaa86b
  //正式key：854f00db3252e4fdf4509998
  constructor() {
    console.log('Hello ConfigServiceProvider Provider');
  }

}
