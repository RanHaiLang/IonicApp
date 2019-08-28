import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, ActionSheetController, Navbar} from 'ionic-angular';
import { WorkingHoursPage } from '../../working-hours/working-hours';
import {NativeServiceProvider} from "../../../providers/native-service/native-service";
import {HttpServiceProvider} from "../../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../../providers/config-service/config-service";
import {Storage} from "@ionic/storage";
import {RequircodeListComponent} from "../../../components/requircode-list/requircode-list";
import {PmListPage} from "../pm-list";
import {WorkHistoryQueryPage} from "../../work-history-query/work-history-query";
import {FileServiceProvider} from "../../../providers/file-service/file-service";
import {FileObj} from "../../../model/FileObj";
import {getBodyNode} from "@angular/animations/browser/src/render/shared";
import {RepairListPage} from "../../repair-list/repair-list";
import {OpinionComponent} from "../../../components/opinion/opinion";

/**
 * Generated class for the PmImplementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pm-implement',
  templateUrl: 'pm-implement.html',
})
export class PmImplementPage {
  //故障信息、维修信息等展开收缩
  public tabSwitch:boolean[]=[true,true,true,true,true];
  //工时登记展开收缩
  workHours:any=[false,false,false];

  pm:any=[];
  actchecklist:any=[];
  token:any;
  evt_org:any;
  namedesc:any;//用户姓名
  username:any;//用户账号
  usr_group:any;//用户组
  bookedhours:any=[];
  history:boolean=true;
  keypage:any="";
  allowDelete:boolean=false;

  @ViewChild(Navbar) navBar: Navbar;
  filePaths: FileObj[] = [];

  datetimestatus:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController,public storage:Storage,
              public httpService:HttpServiceProvider,public config:ConfigServiceProvider,
              public nativeService:NativeServiceProvider,private actionSheetCtrl: ActionSheetController,
              public fileService:FileServiceProvider) {
    this.pm['evt_code'] = this.navParams.get("evt_code");
    this.keypage= this.navParams.get("keyPage");
    if(this.keypage=='history'){//维修履历访问
      this.history=false;
    }
    this.storage.get("token").then((token)=>{
      this.token = token;
      this.getEvtDetail();
      this.getBookedHour();
      this.getDocList();
      this.getPm();
    })
    this.storage.get("evt_org").then((org)=>{
      this.evt_org = org;
    })
    this.storage.get("name").then((namedesc)=>{
      this.namedesc = namedesc;
    })
    this.storage.get("username").then((username)=>{
      this.username = username;
    })
    this.storage.get("usr_group").then((res)=>{
      console.log(res);
      this.usr_group = res;
    })
  }

  //获取工单详情
  getEvtDetail(){
    var url = this.config.url + "appEvent/selectEvtDetail";
    let body = "platform=ios&token="+this.token+"&evt_code="+this.pm['evt_code'];
    this.httpService.post(url,body).subscribe((res)=>{
      let data = res.json()['data'];
      this.pm = data;
      this.pm['evt_target']=(this.pm['evt_target'] ==null?"": this.pm['evt_target'].replace(" ","T").replace(".0",""));
      this.pm['evt_schedend'] =(this.pm['evt_schedend'] ==null?"": this.pm['evt_schedend'].replace(" ","T").replace(".0",""));
      this.pm['evt_pfpromisedate'] =(this.pm['evt_pfpromisedate'] ==null?"": this.pm['evt_pfpromisedate'].replace(" ","T").replace(".0",""));
      this.pm['evt_tfdatecompleted'] =(this.pm['evt_tfdatecompleted'] ==null?"":this.pm['evt_tfdatecompleted'].replace(" ","T").replace(".0",""));
      if(this.pm['evt_target']==""||this.pm['evt_target']==null){
        this.pm['evt_target'] = this.nativeService.dateFormat(new Date(),'yyyy-MM-ddTHH:mm+08:00')
      }
      if(this.pm['evt_pfpromisedate']==""||this.pm['evt_pfpromisedate']==null){
        this.pm['evt_pfpromisedate'] = this.nativeService.dateFormat(new Date(),'yyyy-MM-ddTHH:mm+08:00')
      }
      if(this.pm['evt_tfdatecompleted']==""||this.pm['evt_tfdatecompleted']==null){
        this.pm['evt_tfdatecompleted'] = this.nativeService.dateFormat(new Date(),'yyyy-MM-ddTHH:mm+08:00')
      }

      /**
       * 判断图片能否删除
       * （状态=维修代办、维修退回） and （单据填写人 = 当前账号 = 设备主管)可删除
       * （状态 = 接单执行） and （单据维修人 = 当前账号 = 维修班组）时，可删除
       */
      if((this.pm['evt_status']=='B101'||this.pm['evt_status']=='B110')
        &&(this.pm['evt_enteredby']==this.username||this.usr_group=='JFC-EQZG'||this.usr_group=='JWC-EQZG'||this.usr_group=='JWW-EQZG')){
        this.allowDelete =true;
      }else if((this.pm['evt_status']=='B140')
        &&(this.pm['evt_udfchar08']==this.username||this.usr_group=='JFC-WXBZ'||this.usr_group=='JLQ-EQWX'||this.usr_group=='JSZ-EQWX')){
        this.allowDelete = true;
      }else {
        this.allowDelete = false;
      }

      /**
       * 控制时间控件能否点击
       */
      if(this.pm.evt_status=='B101'||this.pm.evt_status=='B110'){
        this.datetimestatus = false;
      }else {
        this.datetimestatus=true;
      }

      this.getRating();
      this.nextStatus();
    })
  }
  //计划检修工作内容
  getPm(){
    var url = this.config.url + "appEvent/selectActcheckList";
    let body = "platform=ios&token="+this.token+"&evt_code="+this.pm['evt_code'];
    this.httpService.post(url,body,false).subscribe((res)=>{
      let data = res.json();
      this.actchecklist = data['data']['actchecklist'];
      console.log(this.actchecklist)
    })
  }
  updateToDo(event,ack_code){
    for(let i=0;i<this.actchecklist.length;i++){
      if(this.actchecklist[i]['ack_code']==ack_code){
        if(event.checked==true){
          this.actchecklist[i]['ack_completed']="+";
        }else {
          this.actchecklist[i]['ack_completed']="-";
        }
      }
    }
  }
  //获取图片列表
  getDocList(){
    var url = this.config.url + "appEvent/getdoclist";
    let body = "platform=ios&token="+this.token+"&evt_code="+this.pm['evt_code'];
    this.httpService.post(url,body,false).subscribe((res)=>{
      let data = res.json();
      var ImageDate=data['data']['rmDocList'];
      for(var i=0;i<ImageDate.length;i++){
        var suffix = ImageDate[i].doc_filename.substring(ImageDate[i].doc_filename.lastIndexOf(".")+1);
        let fileObj = <FileObj>{'id':ImageDate[i].doc_code,'origPath': ImageDate[i].doc_filename, 'thumbPath':ImageDate[i].doc_filename, 'suffix':suffix};
        this.filePaths.push(fileObj);
      }
    })
  }

  //获取登记工时列表
  getBookedHour(){
    var url = this.config.url +"appEvent/selectBookedhours";
    var body = "platform=ios&token="+this.token+"&boo_event="+this.pm.evt_code;
    this.httpService.post(url,body,false).subscribe((res)=>{
      let data = res.json()['data'];
      this.bookedhours = data['bookedhoursList'];
      for(var i=0;i<this.bookedhours.length;i++){
        this.bookedhours[i]['boo_on'] = this.nativeService.formatSeconds(this.bookedhours[i]['boo_on']);
        this.bookedhours[i]['boo_off'] = this.nativeService.formatSeconds(this.bookedhours[i]['boo_off']);
      }
    })
  }

  //延迟原因
  goRequirList(key,text){
    let modal = this.modalCtrl.create(RequircodeListComponent,{
      token:this.token,
      url:key,
      text:text
    });
    modal.onDidDismiss(data=>{
      this.pm.evt_udfchar18=data['rqm_code'];
    });
    modal.present();
  }

  buttons:any=[];
  StatusButton() {//流程按钮
    let that = this;
    that.actionSheetCtrl.create(
      {
        buttons: this.buttons
      }).present();
  }
  //获取下一步状态按钮
  statusButton:any=[];
  nextStatus(){
    this.storage.get("username").then((username)=>{
      var url = this.config.url + "appEvent/evtnexttype";
      let body = "platform=ios&token="+this.token+"&evtstatus="+this.pm['evt_status']+"&username="+username;
      this.httpService.post(url,body,false).subscribe((res)=>{
        let data = res.json();
        this.statusButton = data['result']
        for(let i=0;i<this.statusButton.length;i++){
          this.buttons.push({
            text: this.statusButton[i].autstatnewdesc, handler: () => {
              this.updatePm(this.statusButton[i].aut_statnew);
            }
          })
        }
        this.buttons.push({text: '取消',role: 'cancel'})

      })
    })
  }

  //维修单详情修改
  updatePm(aut_status){
    var udfnum03 = (new Date(this.pm['evt_schedend'])).valueOf()-(new Date(this.pm['evt_target'])).valueOf();
    if(Number(udfnum03)<0&&this.pm.evt_status!='B110'&&this.pm.evt_status!='B101'){
      this.nativeService.showToast("计划开始时间应早于计划完成时间");
      return
    }else if((this.pm['evt_pfpromisedate']==""||this.pm['evt_pfpromisedate']==""||this.pm['evt_tfdatecompleted']==null||this.pm['evt_tfdatecompleted']=="")&&aut_status=='B165'){
      this.nativeService.showToast("工作开始时间、工作结束时间不能为空");
      return
    }else if((this.rating1==0||this.rating1==null)&&(this.pm.evt_status=='B165'||this.pm.evt_status=='B170')){
      this.nativeService.showToast("请填写维修质量")
    }/*else if((this.rating2==0||this.rating2==null)&&(this.pm.evt_status=='B160'||this.pm.evt_status=='B170')){
      this.nativeService.showToast("请填写维修态度")
    }*/else if ((this.rating3==0||this.rating3==null)&&this.pm.evt_status=='B170'){
      this.nativeService.showToast("请填写维修质量")
    } else {
      if(aut_status=='B150'){//延迟维修
        if(this.pm.evt_udfchar18==''||this.pm.evt_udfchar18==null){
          this.nativeService.showToast("请填写延迟原因");
          return;
        }
      }
      if(this.pm.evt_status=='B165'){
        this.pm['evt_person'] = this.username;
        this.pm['evt_udfchar13'] = this.namedesc;
      }
      if(this.pm.evt_status=='B170'){
        this.pm['evt_origin'] = this.username;
        this.pm['evt_udfchar14'] = this.namedesc;
      }


      var url = this.config.url + "appEvent/updEvent?platform=ios&token="+this.token;
      this.pm['evt_target']= this.pm['evt_target'].replace("T"," ").replace("Z","").replace("+08:00","");
      this.pm['evt_schedend']= this.pm['evt_schedend'].replace("T"," ").replace("Z","").replace("+08:00","");
      this.pm['evt_pfpromisedate']= this.pm['evt_pfpromisedate'].replace("T"," ").replace("Z","").replace("+08:00","");
      this.pm['evt_tfdatecompleted']= this.pm['evt_tfdatecompleted'].replace("T"," ").replace("Z","").replace("+08:00","");
      if(this.pm['evt_schedend']!=null&&this.pm['evt_tfdatecompleted']!=null){
        if((new Date(this.pm['evt_schedend']))<(new Date(this.pm['evt_tfdatecompleted']))){
          this.pm['evt_udfchkbox03']='+'
        }
      }
      this.pm['evt_udfnum03'] = this.rating1;
      this.pm['evt_udfnum04'] = this.rating2;
      this.pm['evt_udfnum05'] = this.rating3;
      let body = JSON.stringify(this.pm);
      if(this.actchecklist.length!=0){
        //处理数组集合
        var arry = new Array();
        arry.push(this.actchecklist);
        var acturl =  this.config.url + "appEvent/updateActCheck?platform=ios&token="+this.token+"&evt_code="+this.pm['evt_code'];
        this.httpService.post(acturl,"str="+JSON.stringify(this.actchecklist).replace(/\+/g, '%2B')).subscribe((ress)=>{
          let d = ress.json();
          if(d['status']==0){
            this.httpService.postJson(url, body,false).subscribe((res) => {
              let data = res.json();
              if (data['status'] == 0) {
                if(aut_status!='ZC'){
                  this.updateStatus(aut_status);
                }
              }else {
                this.nativeService.showToast(data['data']);
              }
            })
          }else {
            this.nativeService.showToast(d['data']);
          }
        })
      }else {
        this.httpService.postJson(url, body).subscribe((res) => {
          let data = res.json();
          if (data['status'] == 0) {
            if(aut_status!='ZC'){
              this.updateStatus(aut_status);
            }
          }else {
            this.nativeService.showToast(data['data']);
          }
        })
      }
    }
  }

  updateStatus(aut_status){
    console.log('aut_status:'+aut_status)
    if(aut_status=='B100'){
      let modal = this.modalCtrl.create(OpinionComponent,{
        evt_code:this.pm.evt_code
      });
      modal.onDidDismiss(data=>{
        if(data==1){
          this.updateEvtStatus(aut_status);
        }
      });
      modal.present();
    }else {
      this.updateEvtStatus(aut_status);
    }
  }

  //修改工单状态
  updateEvtStatus(aut_status){
    var url = this.config.url + "appEvent/updateR5event"
    let body = "platform=ios&token="+this.token
      +"&evt_code="+this.pm.evt_code+"&evt_status="+aut_status
      +"&oldStatus="+this.pm.evt_status+"&username="+this.username;

    this.httpService.post(url,body,false).subscribe((res)=>{
      let data = res.json();
      this.nativeService.showToast(data['data']);
      if(data['status']==0){//修改状态成功
        this.navCtrl.push(PmListPage,{
          evt_code:this.pm.evt_code
        })
      }
    })
  }
  getRating(){
    this.rating1 = this.pm['evt_udfnum03'];
    this.rating2 = this.pm['evt_udfnum04'];
    this.rating3 = this.pm['evt_udfnum05'];
    this.starts1 = [];
    for(let i=1; i<=5;i++){
      this.starts1.push( i>this.rating1 );
    }
    this.starts2 = [];
    for(let i=1; i<=5;i++){
      this.starts2.push( i>this.rating2 );
    }
    this.starts3 = [];
    for(let i=1; i<=5;i++){
      this.starts3.push( i>this.rating3 );
    }
  }

  backButtonClick():void{
    this.navCtrl.push(PmListPage);
  }
  backButtonClick1():void{
    this.navCtrl.push(WorkHistoryQueryPage);
  }
  ionViewDidLoad() {
    if(this.keypage=='history') {//维修履历访问
      this.navBar.backButtonClick = this.backButtonClick1;
    }else {
      this.navBar.backButtonClick = this.backButtonClick;
    }
  }
  //弹出登记工时model
  goToWorkingHoursModal(){
    const modal = this.modalCtrl.create(WorkingHoursPage,{
      evt_code:this.pm['evt_code'],
      pageKey:'pm'
    });
    modal.onDidDismiss(data=>{
      this.getBookedHour();
    });
    modal.present();
  }

    //星星的值
    public starts1:boolean[];
    private rating1:Number=0;
    public starts2:boolean[];
    private rating2:Number=0;
    public starts3:boolean[];
    private rating3:Number=0;
    clickStar(index:number,e:number){
      if(e==1){
        if(this.pm.evt_status!='B170'){//设备工程师不能修改设备主管的评价
          this.rating1 = index + 1;
          this.starts1 = [];
          for(let i=1; i<=5;i++){
            this.starts1.push( i>this.rating1 );
          }
        }
      }else if(e==2){
        if(this.pm.evt_status!='B170'){
          this.rating2 = index + 1;
          this.starts2 = [];
          for(let i=1; i<=5;i++){
            this.starts2.push( i>this.rating2 );
          }
        }
      }else if(e==3){
        this.rating3 = index + 1;
        this.starts3 = [];
        for(let i=1; i<=5;i++){
          this.starts3.push( i>this.rating3 );
        }
      }


    }

}


export class Item{
  constructor(
    public name:string,
    public start:string,
    public end:string,
    public hours:string
  ){

  }
}
