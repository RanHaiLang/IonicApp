import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
declare var Swiper;
/**
 * Generated class for the PreviewPicturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preview-picture',
  templateUrl: 'preview-picture.html',
})
export class PreviewPicturePage {

  @ViewChild('panel') panel: ElementRef;
  initialSlide = 0;
  picturePaths: string[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl: ViewController) {
    this.initialSlide = navParams.get('initialSlide');
    this.picturePaths = navParams.get('picturePaths');
  }

  ionViewDidLoad() {
    new Swiper(this.panel.nativeElement, {
      initialSlide: this.initialSlide, // 初始化显示第几个
      zoom: true, // 双击,手势缩放
      loop: true, // 循环切换
      lazyLoading: true, // 延迟加载
      lazyLoadingOnTransitionStart: true, // lazyLoadingInPrevNext : true,
      pagination: '.swiper-pagination', // 分页器
      paginationType: 'fraction', // 分页器类型
      onClick: () => {
        this.dismiss();
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
