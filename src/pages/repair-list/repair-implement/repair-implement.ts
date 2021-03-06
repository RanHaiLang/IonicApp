import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, ActionSheetController, Navbar, App} from 'ionic-angular';
import { WorkingHoursPage } from '../../working-hours/working-hours';
import {HttpServiceProvider} from "../../../providers/http-service/http-service";
import {ConfigServiceProvider} from "../../../providers/config-service/config-service";
import {RequircodeListComponent} from "../../../components/requircode-list/requircode-list";
import {Storage} from "@ionic/storage";
import {NativeServiceProvider} from "../../../providers/native-service/native-service";
import {StandworkListComponent} from "../../../components/standwork-list/standwork-list";
import {RepairListPage} from "../repair-list";
import {WorkHistoryQueryPage} from "../../work-history-query/work-history-query";
import {FileObj} from "../../../model/FileObj";
import {OpinionComponent} from "../../../components/opinion/opinion";

/**
 * Generated class for the RepairImplementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-repair-implement',
  templateUrl: 'repair-implement.html',
})
export class RepairImplementPage {
  //故障信息、维修信息等展开收缩
  public tabSwitch:boolean[]=[true,true,true,true];
  //工时登记展开收缩
  workHours:any=[false,false,false];

  repair:any=[];
  token:any;
  bookedhours:any=[];
  evt_org:any;
  username:any;//用户登录名
  name:any;//用户姓名
  usr_group:any;//用户组

  history:boolean=true;
  keypage:any="";
  allowDelete:boolean=false;


  @ViewChild(Navbar) navBar: Navbar;

  filePaths: FileObj[] = [];

  datetimestatus:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController,public storage:Storage,
              public httpService:HttpServiceProvider,public config:ConfigServiceProvider,
              public nativeService:NativeServiceProvider,private actionSheetCtrl: ActionSheetController,private app:App) {
      this.repair['evt_code'] = this.navParams.get("evt_code");
      this.keypage= this.navParams.get("keyPage");
      if(this.keypage=='history'){//维修履历访问
        this.history=false;
      }
      console.log(this.repair['evt_code']);
      this.storage.get("token").then((token)=>{
        this.token = token;
        this.getBookedHour();
        this.getEvtDetail();
        this.getDocList();
      });
      this.storage.get("evt_org").then((org)=>{
          this.evt_org = org;
      });
      this.storage.get("name").then((username)=>{
          this.username = username;
      });
      this.storage.get("username").then((username)=>{
        this.name = username;
      })
      this.storage.get("usr_group").then((res)=>{
        console.log(res);
        this.usr_group = res;
      })
  }



  //获取工单详情
  pfpdate:boolean=false;
  tfdate:boolean=false;
  getEvtDetail(){
    var url = this.config.url + "appEvent/selectEvtDetail";
    let body = "platform=ios&token="+this.token+"&evt_code="+this.repair['evt_code'];
    this.httpService.post(url,body).subscribe((res)=>{
      let data = res.json()['data'];
      this.repair = data;
      this.repair.evt_tfpromisedate = this.repair.evt_tfpromisedate==null?"":this.repair.evt_tfpromisedate.replace(" ","T").replace(".0","");
      this.repair.evt_target=(this.repair.evt_target ==null?"": this.repair.evt_target.replace(" ","T").replace(".0",""));
      this.repair.evt_schedend =(this.repair.evt_schedend ==null?"": this.repair.evt_schedend.replace(" ","T").replace(".0",""));
      this.repair.evt_pfpromisedate =(this.repair['evt_pfpromisedate'] ==null?"": this.repair['evt_pfpromisedate'].replace(" ","T").replace(".0",""));
      this.repair.evt_tfdatecompleted =(this.repair['evt_tfdatecompleted'] ==null?"":this.repair['evt_tfdatecompleted'].replace(" ","T").replace(".0",""));

      /**
       * 判断图片能否删除
       * （状态=维修代办、维修退回） and （单据填写人 = 当前账号 = 生产班组长)可删除
       * （状态 = 接单执行） and （单据维修人 = 当前账号 = 维修班组）时，可删除
       */
      if((this.repair['evt_status']=='B101'||this.repair['evt_status']=='B110')
        &&(this.repair['evt_enteredby']==this.username||this.usr_group=='JFC-SCBZZ')){
          this.allowDelete =true;
      }else if((this.repair['evt_status']=='B140')
        &&(this.repair['evt_udfchar08']==this.username||this.usr_group=='JFC-WXBZ'||this.usr_group=='JLQ-EQWX'||this.usr_group=='JSZ-EQWX')){
          this.allowDelete = true;
      }else {
          this.allowDelete = false;
      }

      /**
       * 控制时间控件能否点击
       */
      if(this.repair.evt_status=='B101'||this.repair.evt_status=='B110'){
        this.datetimestatus = false;
      }else {
        this.datetimestatus=true;
      }

      if(this.repair.evt_tfpromisedate==""||this.repair.evt_tfpromisedate==null){
        this.repair.evt_tfpromisedate = this.nativeService.dateFormat(new Date(),'yyyy-MM-ddTHH:mm+08:00')
      }
      if(this.repair.evt_target==""||this.repair.evt_target==null){
        this.repair.evt_target = this.nativeService.dateFormat(new Date(),'yyyy-MM-ddTHH:mm+08:00')
      }
      this.repair.evt_udfnum02 = (this.repair.evt_udfnum02*60).toFixed(0);
      if(this.repair.evt_pfpromisedate==""||this.repair.evt_pfpromisedate==null){
        this.repair.evt_pfpromisedate = this.nativeService.dateFormat(new Date(),'yyyy-MM-ddTHH:mm+08:00');
        this.pfpdate=true;
      }
      if(this.repair.evt_tfdatecompleted==""||this.repair.evt_tfdatecompleted==null){
        this.repair.evt_tfdatecompleted = this.nativeService.dateFormat(new Date(),'yyyy-MM-ddTHH:mm+08:00')
        this.tfdate = true;
      }
      if(this.pfpdate==true&&this.tfdate==true){//维修开始、完成时间为空时
        this.repair.evt_udfnum02 = 0;
      }
      this.repair.evt_reported = this.repair.evt_reported.replace(/-/g,'/');
      let evt_downtimehrs = (this.repair.evt_downtimehrs*60).toFixed(0);
      this.repair.evt_downtimehrs = (evt_downtimehrs=='0'?"":evt_downtimehrs);
      this.getRating();
      if(this.repair['evt_status']=='B160'){
        if(this.repair['evt_enteredby']==this.name){
          this.nextStatus();
        }else {
          this.buttons.push({text: '取消',role: 'cancel'})
        }
      }else {
        this.nextStatus();
      }
    })
  }

  //获取图片列表
  getDocList(){
    var url = this.config.url + "appEvent/getdoclist";
    let body = "platform=ios&token="+this.token+"&evt_code="+this.repair['evt_code'];
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
    var body = "platform=ios&token="+this.token+"&boo_event="+this.repair.evt_code;
    this.httpService.post(url,body,false).subscribe((res)=>{
      let data = res.json()['data'];
      this.bookedhours = data['bookedhoursList'];
      for(var i=0;i<this.bookedhours.length;i++){
          this.bookedhours[i]['boo_on'] = this.nativeService.formatSeconds(this.bookedhours[i]['boo_on']);
          this.bookedhours[i]['boo_off'] = this.nativeService.formatSeconds(this.bookedhours[i]['boo_off']);
      }
    })
  }

  getudfnum02(){
    var udfnum02 = this.nativeService.timeFn(this.repair['evt_pfpromisedate'].replace("T"," ").replace("Z","").replace("+08:00",""),this.repair['evt_tfdatecompleted'].replace("T"," ").replace("Z","").replace("+08:00",""));
    if(Number(udfnum02)<=0){
     this.nativeService.showToast("维修开始时间应早于维修完成时间");
     return;
     }
    this.repair.evt_udfnum02 = (Number(udfnum02)*60).toFixed(0);
  }

  goRequirList(key,text,publicparams){
    let modal = this.modalCtrl.create(RequircodeListComponent,{
      token:this.token,
      url:key,
      publicparams:publicparams,
      text:text
    });
    modal.onDidDismiss(data=>{
      console.log("data:"+data);
      if(text=='问题'){
        if(data==""){
          this.repair.evt_reqm = "";
          this.repair.evt_udfchar04 = "";
        }else {
          this.repair.evt_reqm = data['rqm_code'];
          this.repair.evt_udfchar04 = data['rqm_desc'];
        }
      }else if(text=='原因'){
        if(data==""){
          this.repair.evt_cause = "";
          this.repair.evt_udfchar05 = "";
        }else {
          this.repair.evt_cause = data['rqm_code'];
          this.repair.evt_udfchar05 = data['rqm_desc'];
        }
      }else if(text=='行动'){
        if(data==""){
          this.repair.evt_action = "";
          this.repair.evt_udfchar06 = "";
        }else {
          this.repair.evt_action = data['rqm_code'];
          this.repair.evt_udfchar06 = data['rqm_desc'];
        }
      }else if(text=='延迟原因'){
        if(data==""){
          this.repair.evt_udfchar18="";
        }else {
          this.repair.evt_udfchar18=data['rqm_code'];
        }

      }
    });
    modal.present();
  }

  //标准工单
  evt_standwork_desc:any="";
  gostandworkList(){
    let modal = this.modalCtrl.create(StandworkListComponent,{
      token:this.token,
      stw_class:'JS13'
    });
    modal.onDidDismiss(data=>{
      if(data!=null&&data!=""){
        console.log(data['stw_desc']);
        this.evt_standwork_desc = data['stw_desc'];
        console.log(this.evt_standwork_desc)
        this.repair['evt_standwork'] = data['stw_code'];
      }
    });
    modal.present();
  }

  //维修单详情修改
  updateRepair(aut_status){
    if(aut_status=='B150'){//延迟维修
      if(this.repair.evt_udfchar18==''||this.repair.evt_udfchar18==null){
        this.nativeService.showToast("请填写延迟原因")
        return;
      }else {
        this.saveMessage(aut_status);
      }
    }else {
      if((this.repair['evt_udfchar11']=="" || this.repair['evt_udfchar11']==null)&&(this.repair['evt_udfchar12']=="" || this.repair['evt_udfchar12']==null)&&(this.repair['evt_udfchar20']=="" || this.repair['evt_udfchar20']==null)){
        if(this.repair['evt_udfchar04']==""||this.repair['evt_udfchar04']==null
          ||this.repair['evt_udfchar05']==""||this.repair['evt_udfchar05']==null
          ||this.repair['evt_udfchar06']==""||this.repair['evt_udfchar06']==null){
          this.nativeService.showToast("请选择【问题描述、原因描述、行动描述】。若无法选择，请填写【问题鉴定、原因鉴定、行动鉴定】。")
        }else {
          this.saveMessage(aut_status);
        }
      }else {
        if((this.repair['evt_udfchar11']=="" || this.repair['evt_udfchar11']==null)&&this.repair['evt_status']!='B110'&&this.repair['evt_status']!='B101'&&aut_status!='B101'&&aut_status!='B120'&&aut_status!='B150'){
          this.nativeService.showToast("请选择【问题描述、原因描述、行动描述】。若无法选择，请填写【问题鉴定、原因鉴定、行动鉴定】。")
        }else if((this.repair['evt_udfchar12']=="" || this.repair['evt_udfchar12']==null)&&this.repair['evt_status']!='B110'&&this.repair['evt_status']!='B101'&&aut_status!='B101'&&aut_status!='B120'&&aut_status!='B150'){
          this.nativeService.showToast("请选择【问题描述、原因描述、行动描述】。若无法选择，请填写【问题鉴定、原因鉴定、行动鉴定】。")
        }else if((this.repair['evt_udfchar20']==""||this.repair['evt_udfchar20']==null)&&this.repair['evt_status']!='B110'&&this.repair['evt_status']!='B101'&&aut_status!='B101'&&aut_status!='B120'&&aut_status!='B150'){
          this.nativeService.showToast("请选择【问题描述、原因描述、行动描述】。若无法选择，请填写【问题鉴定、原因鉴定、行动鉴定】。")
        }else {
          this.saveMessage(aut_status);
        }
      }
    }

  }
  //保存信息
  saveMessage(aut_status){
    var udfnum02 = this.nativeService.timeFn(this.repair['evt_pfpromisedate'].replace("T"," ").replace("Z","").replace("+08:00",""),this.repair['evt_tfdatecompleted'].replace("T"," ").replace("Z","").replace("+08:00",""));
    var udfnum03 = (new Date(this.repair['evt_schedend'])).valueOf()-(new Date(this.repair['evt_target'])).valueOf();
    if((this.rating1==0||this.rating1==null)&&(this.repair.evt_status=='B160'||this.repair.evt_status=='B165'||this.repair.evt_status=='B170')){
      this.nativeService.showToast("请填写维修质量")
    }else if((this.rating2==0||this.rating2==null)&&(this.repair.evt_status=='B160'||this.repair.evt_status=='B165'||this.repair.evt_status=='B170')){
      this.nativeService.showToast("请填写维修态度")
    }else if ((this.rating3==0||this.rating3==null)&&(this.repair.evt_status=='B165'||this.repair.evt_status=='B170')){
      this.nativeService.showToast("请填写维修质量")
    }else if(Number(udfnum02)<=0&&this.repair.evt_status!='B110'&&this.repair.evt_status!='B101'&&aut_status!='B150'){
      this.nativeService.showToast("维修开始时间应早于维修结束时间");
      return;
    }else if(Number(udfnum03)<0&&this.repair.evt_status!='B110'&&this.repair.evt_status!='B101'&&aut_status!='B150'){
      this.nativeService.showToast("计划开始时间应早于计划完成时间");
      return;
    }else {
      if(this.repair['evt_status']=='B140'){
        let udfnum01 = (this.repair['evt_udfnum01']/60).toFixed(2);
        if(parseInt(udfnum01) < 15){//维修时常小于15分钟时
          this.repair['evt_udfchkbox02']='+';
        }else {
          this.repair['evt_udfchkbox02']='-';
        }
      }
      if(this.repair['evt_schedend']!=null&&this.repair['evt_tfdatecompleted']!=null){
        if((new Date(this.repair['evt_schedend']))<(new Date(this.repair['evt_tfdatecompleted']))){
          this.repair['evt_udfchkbox03']='+'
        }
      }
      console.log(aut_status)
      if(aut_status=='B160'){//现场评价
        if(this.repair.evt_udfnum02==''||this.repair.evt_udfnum02==null||this.repair.evt_udfnum02==0){
          this.nativeService.showToast("维修时长不能为0和空")
          return;
        }else if(this.repair.evt_downtimehrs==''||this.repair.evt_downtimehrs==null){
          this.nativeService.showToast("请填写故障停机时长")
          return;
        }
      }

      if(this.repair.evt_status=='B160'){
        this.repair['evt_person'] = this.name;
        this.repair['evt_udfchar13'] = this.username;
      }
      if(this.repair.evt_status=='B165' || this.repair.evt_status=='B170'){//设备主管评价、设备工程师
        this.repair['evt_origin'] = this.name;
        this.repair['evt_udfchar14'] = this.username;
      }
      //将停机时长和维修时长分钟转换成小时
      if(this.repair.evt_udfnum02>0){
        this.repair.evt_udfnum02 = (this.repair.evt_udfnum02/60).toFixed(2);
        console.log("维修时常："+this.repair.evt_udfnum02)
      }
      if(this.repair.evt_downtimehrs>0){
        this.repair.evt_downtimehrs = (this.repair.evt_downtimehrs/60).toFixed(2);
      }
      console.log(this.repair.evt_udfnum02+":"+this.repair.evt_downtimehrs)
      var url = this.config.url + "appEvent/updEvent?platform=ios&token="+this.token;
      this.repair['evt_tfpromisedate']= this.repair['evt_tfpromisedate'].replace("T"," ").replace("Z","").replace("+08:00","");
      this.repair['evt_target']= this.repair['evt_target'].replace("T"," ").replace("Z","").replace("+08:00","");
      this.repair['evt_schedend']= this.repair['evt_schedend'].replace("T"," ").replace("Z","").replace("+08:00","");
      this.repair['evt_pfpromisedate']= this.repair['evt_pfpromisedate'].replace("T"," ").replace("Z","").replace("+08:00","");
      this.repair['evt_tfdatecompleted']= this.repair['evt_tfdatecompleted'].replace("T"," ").replace("Z","").replace("+08:00","");
      this.repair.evt_reported = this.repair.evt_reported.replace('/','-').replace('/','-');//格式转换兼容ios不能显示问题

      this.repair['evt_udfnum03'] = this.rating1;
      this.repair['evt_udfnum04'] = this.rating2;
      this.repair['evt_udfnum05'] = this.rating3;
      let body = JSON.stringify(this.repair);
      this.httpService.postJson(url,body).subscribe((res)=>{
        let data = res.json();
        if(data['status']==0){
          console.log(aut_status)
          if(aut_status!='ZC'){
            this.updateStatus(aut_status);
          }else {
            this.repair.evt_udfnum02 = (this.repair.evt_udfnum02*60).toFixed(0);
            this.repair.evt_downtimehrs = (this.repair.evt_downtimehrs*60).toFixed(0);
          }
        }else {
          this.repair.evt_udfnum02 = (Number(this.repair.evt_udfnum02)*60).toFixed(0);
          this.repair.evt_downtimehrs = (this.repair.evt_downtimehrs*60).toFixed(0);
          this.nativeService.showToast(data['data']);
        }
      })
    }
  }
  updateStatus(aut_status){
    console.log('aut_status:'+aut_status)
    if(aut_status=='B100'){
      let modal = this.modalCtrl.create(OpinionComponent,{
        evt_code:this.repair.evt_code
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
    //更新状态
    var url = this.config.url + "appEvent/updateR5event"
    let body = "platform=ios&token="+this.token
      +"&evt_code="+this.repair.evt_code+"&evt_status="+aut_status
      +"&oldStatus="+this.repair.evt_status+"&username="+this.name;

    this.httpService.post(url,body,false).subscribe((res)=>{
      let data = res.json();
      this.nativeService.showToast(data['data']);
      if(data['status']==0){//修改状态成功
        this.navCtrl.push(RepairListPage,{
          evt_code:this.repair.evt_code
        })
      }
    })
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
      var url = this.config.url + "appEvent/evtnexttype?evtstatus="+this.repair['evt_status']+"&username="+username;
      let body = "platform=ios&token="+this.token;
      this.httpService.post(url,body,false).subscribe((res)=>{
        let data = res.json();
        this.statusButton = data['result']
        for(let i=0;i<this.statusButton.length;i++){
          this.buttons.push({
            text: this.statusButton[i].autstatnewdesc, handler: () => {
              this.updateRepair(this.statusButton[i].aut_statnew);
            }
          })
        }
        this.buttons.push({text: '取消',role: 'cancel'})

      })
    })
  }


  getRating(){
    console.log(this.repair['evt_udfnum03']+":"+this.repair['evt_udfnum04']+":"+this.repair['evt_udfnum05'])
    this.rating1 = this.repair['evt_udfnum03'];
    this.rating2 = this.repair['evt_udfnum04'];
    this.rating3 = this.repair['evt_udfnum05'];
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
    this.navCtrl.push(RepairListPage);
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
      evt_code:this.repair['evt_code'],
      pageKey:'repair'
    });
    modal.onDidDismiss(data=>{
      this.getBookedHour();
    });
    modal.present();
  }

  //删除工时
  /*deleteWorkingHours(boo_event,boo_code){
    var url = this.config.url +"appEvent/deletebook";
    let body = "platform=ios&token="+this.token+"&boo_event="+boo_event+"&boo_code="+boo_code;
    this.httpService.post(url,body).subscribe((res)=>{
      let data = res.json();
      if(data['result']==0){
        this.getBookedHour();
      }else {
        this.nativeService.showToast(data['data']);
      }
    })
  }*/

  //星星的值
  public starts1:boolean[];
  private rating1:Number=0;
  public starts2:boolean[];
  private rating2:Number=0;
  public starts3:boolean[];
  private rating3:Number=0;
  clickStar(index:number,e:number){
    if(e==1){
      if(this.repair.evt_status!='B165'&&this.repair.evt_status!='B170'){
        this.rating1 = index + 1;
        this.starts1 = [];
        for(let i=1; i<=5;i++){
          this.starts1.push( i>this.rating1 );
        }
      }
    }else if(e==2){
      if(this.repair.evt_status!='B165'&&this.repair.evt_status!='B170'){
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

