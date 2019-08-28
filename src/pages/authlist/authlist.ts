import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AuthlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-authlist',
  templateUrl: 'authlist.html',
})
export class AuthlistPage {

  public items:Item[] = [
    new Item('油机两个按键中间贴膜破裂，申请更换油机两个按键中间贴膜破裂，申请更换','小维修关闭','投资项目调剂请示','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换油机两个按键中间贴膜破裂，申请更换','小维修关闭','模具项目调剂请示','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换油机两个按键中间贴膜破裂，申请更换','小维修关闭','投资项目立项申购','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换油机两个按键中间贴膜破裂，申请更换','小维修关闭','模具项目立项申购','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','维修性项目立项申购','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','投资项目变更','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','模具项目变更','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','维修性项目变更','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','设备招议标申请','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','模具招议标申请','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','设备采购结果审批','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','模具采购结果审批','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','设备合同审批','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','模具合同审批','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','设备款项支付申请','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','模具款项支付申请','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','使用部门款项支付申请','201810230102','马静辉','2018-02-03'),
    new Item('油机两个按键中间贴膜破裂，申请更换','小维修关闭','资产调拨','201810230102','马静辉','2018-02-03'),
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthlistPage');
  }

  doRefresh(refresher){
    setTimeout(() => {refresher.complete();
    }, 2000);
  }

}


export class Item{
  constructor(
    
    public describe:string,
    public state:string,
    public name:string,
    public code:string,
    public person:string,
    public time:string
  ){
    
  }
}