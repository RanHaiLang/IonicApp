import {Injectable} from '@angular/core';
import {Platform, ToastController, AlertController, LoadingController, Loading} from "ionic-angular";
import {Network} from "@ionic-native/network";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Observable} from "rxjs";
import {ImagePicker} from "@ionic-native/image-picker";
import {File, FileEntry} from '@ionic-native/file';
import {StatusBar} from "@ionic-native/status-bar";
import {AppMinimize} from "@ionic-native/app-minimize";

/*
  Generated class for the NativeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NativeServiceProvider {


  public loading: Loading;
  private loadingIsOpen: boolean = false;
  constructor(private platform: Platform,private network: Network,
              public toastCtrl:ToastController,private alertCtrl:AlertController,
              public loadingCtrl:LoadingController,public camera:Camera,
              private imagePicker: ImagePicker,private file:File,
              private statusBar: StatusBar,public appMinimize:AppMinimize) {
  }


  /**
   * 判断是否有网络
   * @returns {boolean}
   */
  isConnecting(): boolean {
    return this.getNetworkType() != 'none';
  }
  /**
   * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
   */
  getNetworkType(): string {
    if (!this.isMobile()) {
      return 'wifi';
    }
    return this.network.type;
  }
  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }
  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast(message: string = '操作完成', duration: number = 2000): void {
    this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'middle',
      showCloseButton: false
    }).present();
  };

  showAlert(title,subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['确定']
    });
    alert.present();
  }

  //统一调用此方法显示loading
  showLoading(content:string=''):void{
    if(!this.loadingIsOpen){
      this.loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content:content
      });
      this.loading.present();
      setTimeout(()=>{//最长显示30秒
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
      },60000)
    }
  };
  //关闭loading
  hideLoading():void{
    this.loadingIsOpen && this.loading.dismiss();
    this.loadingIsOpen = false;
  }

  /**
   * 状态栏
   */
  statusBarStyle(): void {
    if (this.isMobile()) {
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      // this.statusBar.styleDefault(); // 使用黑色字体
      this.statusBar.backgroundColorByHexString('#0a214a'); // 3261b3
    }
  }

  /**
   * 调用最小化app插件
   */
  minimize(): void {
    this.appMinimize.minimize();
  }


  /**
   * 只有一个确定按钮的弹出框.
   * 如果已经打开则不再打开
   */
  alert = (() => {
    let isExist = false;
    return (title: string, subTitle = '', message = '', callBackFun = null): void => {
      if (!isExist) {
        isExist = true;
        this.alertCtrl.create({
          title,
          subTitle,
          message,
          cssClass: 'alert-zIndex-highest',
          buttons: [{
            text: '确定', handler: () => {
              isExist = false;
              callBackFun && callBackFun();
            }
          }],
          enableBackdropDismiss: false
        }).present();
      }
    };
  })();

  //时间戳转换为日期
  getTime(date):any{
    date = new Date(date);
    console.log(date);
    var Y = date.getFullYear();
    var M = (date.getMonth()+1)/10<1?"0"+(date.getMonth()+1):(date.getMonth()+1);
    var D = date.getDate()/10<1?"0"+date.getDate():date.getDate();
    var H = date.getHours()/10<1?"0"+date.getHours():date.getHours();
    var m = date.getMinutes()/10<1?"0"+date.getMinutes():date.getMinutes();
    var s = date.getSeconds()/10<1?"0"+date.getSeconds():date.getSeconds();
    return Y+"-"+M+"-"+D+" "+H+":"+m+":"+s;
  }

  //将秒转换成时分
  formatSeconds(value) {
    //32280
    var secondTime = value;// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟,Math.ceil向下取整
      minuteTime = Math.floor(secondTime/60);
      //获取秒数，秒数取佘，得到整数秒数
      //secondTime = secondTime%60;
      //如果分钟大于60，将分钟转换成小时
      if(minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime =  Math.floor(minuteTime/60);
        //获取小时后的分,总分钟数减去取整的分钟数
        minuteTime = Math.floor(value/60)-(hourTime*60);
      }
    }
    var result ="";
    if(minuteTime > 0) {
      result = ""+ minuteTime;
    }else {
      result = "00";
    }
    if(hourTime > 0) {
      result = hourTime + ":" + result;
    }else {
      result = "00:" + result;
    }
    return result;
  }


  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                               "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @returns {string}
   */
  dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    let time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
  }


  //时间差的小时
  timeFn(d1,d2) {//di,d2作为一个变量传进来
    //console.log(d2);
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateBegin = new Date(d1.replace(/-/g, "/"));//将-转化为/，使用new Date
    var dateEnd = new Date(d2.replace(/-/g, "/"));//将-转化为/，使用new Date
    var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))//计算出小时数
    //计算相差分钟数
    var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
    //计算相差秒数
    var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000)
    //console.log(" 相差 "+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒");
    //console.log("小时："+((dayDiff*24)+hours+(minutes/60)+(minutes/3600)).toFixed(2));
    return ((dayDiff*24)+hours+(minutes/60)+(minutes/3600)).toFixed(2)
  }



  /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
  getPicture(options: CameraOptions = {}): Observable<string> {
    const ops: CameraOptions = {
      sourceType: this.camera.PictureSourceType.CAMERA, // 图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
      destinationType: this.camera.DestinationType.FILE_URI, // 默认返回图片路径：DATA_URL:base64字符串，FILE_URI:图片路径
      quality: 100, // 图像质量，范围为0 - 100
      allowEdit: false, // 选择图片前是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1000, // 缩放图像的宽度（像素）
      targetHeight: 1000, // 缩放图像的高度（像素）
      saveToPhotoAlbum: false, // 是否保存到相册
      correctOrientation: true, ...options
    };
    return Observable.create(observer => {
      this.camera.getPicture(ops).then((imgData: string) => {
        if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
          observer.next('data:image/jpg;base64,' + imgData);
        } else {
          observer.next(imgData);
        }
      }).catch(err => {
        if (err == 20) {
          this.alert('没有权限,请在设置中开启权限');
        } else if (String(err).indexOf('cancel') != -1) {
          console.log('用户点击了取消按钮');
        } else {
          console.log(err, '使用cordova-plugin-camera获取照片失败');
          this.alert('获取照片失败');
        }
        observer.error(false);
      });
    });
  }

  /**
   * 通过图库选择多图
   * @param options
   */
  getMultiplePicture(options = {}): Observable<any> {
    const that = this;
    const ops = {
      maximumImagesCount: 6,
      width: 1000, // 缩放图像的宽度（像素）
      height: 1000, // 缩放图像的高度（像素）
      quality: 100, ...options
    };
    return Observable.create(observer => {
      this.imagePicker.getPictures(ops).then(files => {
        const destinationType = options['destinationType'] || 0; // 0:base64字符串,1:图片url
        if (destinationType === 1) {
          observer.next(files);
        } else {
          const imgBase64s = []; // base64字符串数组
          for (const fileUrl of files) {
            that.convertImgToBase64(fileUrl).subscribe(base64 => {
              imgBase64s.push(base64);
              if (imgBase64s.length === files.length) {
                observer.next(imgBase64s);
              }
            });
          }
        }
      }).catch(err => {
        console.log(err, '通过图库选择多图失败');
        this.alert('获取照片失败');
        observer.error(false);
      });
    });
  }

  /**
   * 根据图片绝对路径转化为base64字符串
   * @param path 绝对路径
   */
  convertImgToBase64(path: string): Observable<string> {
    return Observable.create(observer => {
      this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          const reader = new FileReader();
          reader.onloadend = function (e) {
            observer.next(this.result);
          };
          reader.readAsDataURL(<Blob>file);
        });
      }).catch(err => {
        console.log(err, '根据图片绝对路径转化为base64字符串失败');
        observer.error(false);
      });
    });
  }



}
