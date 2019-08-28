import {Component, EventEmitter, Output, Input} from '@angular/core';
import {
  IonicPage, NavController, NavParams, ModalController, ActionSheetController,
  AlertController
} from 'ionic-angular';
import {FileObj} from "../../../model/FileObj";
import {NativeServiceProvider} from "../../../providers/native-service/native-service";
import {FileServiceProvider} from "../../../providers/file-service/file-service";
import {PreviewPicturePage} from "../preview-picture/preview-picture";
import {ConfigServiceProvider} from "../../../providers/config-service/config-service";
import {HttpServiceProvider} from "../../../providers/http-service/http-service";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the SelectPicturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-picture',
  templateUrl: 'select-picture.html',
})
export class SelectPicturePage {

  @Input() max = 4; // 最多可选择多少张图片，默认为4张

  @Input() allowAdd = true; // 是否允许新增

  @Input() allowDelete = true; // 是否允许删除
  @Input() addView = true; // 是否显示添加图标

  @Input() evtcode="";
  @Input() keypage="";

  @Input() fileObjList: FileObj[] = []; // 图片列表,与fileObjListChange形成双向数据绑定
  @Output() fileObjListChange = new EventEmitter<any>();

  token:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private nativeService: NativeServiceProvider,private modalCtrl: ModalController,
              private alertCtrl: AlertController,private actionSheetCtrl: ActionSheetController,
              public fileService:FileServiceProvider,public config:ConfigServiceProvider,
              public httpService:HttpServiceProvider,public sotrage:Storage) {
    this.sotrage.get("token").then((token)=>{
      this.token = token;
    })
  }

  addPicture() {// 新增照片
    const that = this;
    that.actionSheetCtrl.create({
      buttons: [
        {
          text: '从相册选择',
          handler: () => {
            that.nativeService.getMultiplePicture({// 从相册多选
              maximumImagesCount: that.max,
              destinationType: 1 // 期望返回的图片格式,1图片路径
            }).subscribe(imgs => {
              //that.getPictureSuccess(imgs);
              for (const img of imgs as string[]) {
                that.getPictureSuccess(img);
              }
            });
          }
        },
        {
          text: '拍照',
          handler: () => {
            that.nativeService.getPicture().subscribe(img => {
              that.getPictureSuccess(img);
            });
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    }).present();
  }

  deletePicture(i,doc_code) {// 删除照片
    if (!this.allowDelete) {
      return;
    }
    this.alertCtrl.create({
      title: '确认删除？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            console.log("re:"+this.keypage);
            if(this.keypage=="repair"){
              this.fileObjList.splice(i, 1);
            }else {
              var url = this.config.url+"appEvent/deleteeamdoc";
              let body = "platform=ios&token="+this.token+"&doc_code="+doc_code;
              this.httpService.post(url,body).subscribe((res)=>{
                let data = res.json();
                this.nativeService.showToast(data['data'])
                if(data['status']==0) {
                  this.fileObjList.splice(i, 1);
                }
              })
            }
          }
        }
      ]
    }).present();
  }

  viewerPicture(index) { // 照片预览
    const picturePaths = [];
    for (const fileObj of this.fileObjList) {
      picturePaths.push(fileObj.origPath);
    }
    this.modalCtrl.create(PreviewPicturePage, {'initialSlide': index, 'picturePaths': picturePaths}).present();
  }

  filelist:FileObj[]=[];
  private getPictureSuccess(img) {
    var _that = this;
    console.log("isrepair:"+this.keypage);
    if(_that.keypage!="repair"){//非报修图片上传
      _that.filelist=[];
      let fileObj = {'origPath': img, 'thumbPath': img};
      _that.filelist.push(<FileObj>fileObj);
      _that.fileService.upload(_that.filelist,_that.evtcode,function (res) {
        if(res==_that.filelist.length){
          //获取详细信息
          var url = _that.config.url + "appEvent/getdoclist";
          let body = "platform=ios&token="+_that.token+"&evt_code="+_that.evtcode;
          _that.httpService.post(url,body).subscribe((res)=>{
            let data = res.json();

            _that.fileObjList=[];
            var ImageDate=data['data']['rmDocList'];
            for(var i=0;i<ImageDate.length;i++){
              var suffix = ImageDate[i].doc_filename.substring(ImageDate[i].doc_filename.lastIndexOf(".")+1);
              let fileObj = <FileObj>{'id':ImageDate[i].doc_code,'origPath': ImageDate[i].doc_filename, 'thumbPath':ImageDate[i].doc_filename, 'suffix':suffix};
              _that.fileObjList.push(fileObj);
            }
            _that.fileObjListChange.emit(_that.fileObjList);
          })
        }

      })
    }else {
      if(img!=''&&img!=null&&img!=undefined){
        let fileObj = {'origPath': img, 'thumbPath': img};
        _that.fileObjList.push(<FileObj>fileObj);
        _that.fileObjListChange.emit(_that.fileObjList);
      }
    }

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectPicturePage');
  }

}
