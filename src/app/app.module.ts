import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MenuPage } from '../pages/menu/menu';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

import { LoginPageModule } from '../pages/login/login.module';
import { ChangePasswordPageModule } from './../pages/contact/change-password/change-password.module';
import { AboutUsPageModule } from '../pages/contact/about-us/about-us.module';
import { EquipmentQueryPageModule } from '../pages/equipment-query/equipment-query.module';
import { RepairListPageModule } from '../pages/repair-list/repair-list.module';
import { RepairPageModule } from '../pages/repair-list/repair/repair.module';
import { RepairImplementPageModule } from '../pages/repair-list/repair-implement/repair-implement.module';
import { WorkingHoursPageModule } from '../pages/working-hours/working-hours.module';
import { PlanListPageModule } from '../pages/plan-list/plan-list.module';
import { PlanImplementPageModule } from '../pages/plan-list/plan-implement/plan-implement.module';
import { PmListPageModule } from '../pages/pm-list/pm-list.module';
import { PmImplementPageModule } from '../pages/pm-list/pm-implement/pm-implement.module';
import { WorkHistoryQueryPageModule } from '../pages/work-history-query/work-history-query.module';
import { FactoryKpiPageModule } from '../pages/factory-kpi/factory-kpi.module';
import { CompanyKpiPageModule } from '../pages/company-kpi/company-kpi.module';
import { NoticePageModule } from './../pages/notice-list/notice/notice.module';
import { NoticeListPageModule } from '../pages/notice-list/notice-list.module';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { ConfigServiceProvider } from '../providers/config-service/config-service';
import {HttpModule} from "@angular/http";
import { NativeServiceProvider } from '../providers/native-service/native-service';
import {HttpClientModule} from "@angular/common/http";
import {Network} from "@ionic-native/network";
import {AuthlistPageModule} from "../pages/authlist/authlist.module";
import {WechatbindPageModule} from "../pages/wechatbind/wechatbind.module";
import {AuthPageModule} from "../pages/auth/auth.module";
import {WechatunbindPageModule} from "../pages/wechatunbind/wechatunbind.module";
import {ErrorPageModule} from "../pages/error/error.module";
import { FileServiceProvider } from '../providers/file-service/file-service';
import {SelectPicturePageModule} from "../pages/shared/select-picture/select-picture.module";
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import { GlobalDataProvider } from '../providers/global-data/global-data';
import {File} from "@ionic-native/file";
import {FileTransfer} from "@ionic-native/file-transfer";
import {Auth1PageModule} from "../pages/auth1/auth1.module";
import {Keyboard} from "@ionic-native/keyboard";
import { HelperProvider } from '../providers/helper/helper';
import {JPush} from "@jiguang-ionic/jpush";
import {AppMinimize} from "@ionic-native/app-minimize";
import { BackButtonProvider } from '../providers/back-button/back-button';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {QRScanner} from "@ionic-native/qr-scanner";
import {QrscannerPageModule} from "../pages/shared/qrscanner/qrscanner.module";
import {SharedQrcodePageModule} from "../pages/shared-qrcode/shared-qrcode.module";
import {OpenNativeSettings} from "@ionic-native/open-native-settings";


@NgModule({
  declarations: [
    MyApp,
    MenuPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '返回',
      mode: 'ios',
      tabsHideOnSubPages: 'true' ,
      menuType: 'push',
      platforms: {
        ios: {
          menuType: 'overlay',
        }
      }
    }),
    IonicStorageModule.forRoot(),
    LoginPageModule,
    ChangePasswordPageModule,
    AboutUsPageModule,
    EquipmentQueryPageModule,
    RepairListPageModule,
    RepairPageModule,
    RepairImplementPageModule,
    WorkingHoursPageModule,
    PlanListPageModule,
    PlanImplementPageModule,
    PmListPageModule,
    PmImplementPageModule,
    WorkHistoryQueryPageModule,
    FactoryKpiPageModule,
    CompanyKpiPageModule,
    NoticeListPageModule,
    NoticePageModule,
    AuthlistPageModule,
    WechatbindPageModule,
    WechatunbindPageModule,
    AuthPageModule,
    Auth1PageModule,
    NoticePageModule,
    ErrorPageModule,
    SelectPicturePageModule,
    QrscannerPageModule,
    SharedQrcodePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MenuPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpServiceProvider,
    ConfigServiceProvider,
    NativeServiceProvider,
    Network,
    FileServiceProvider,
    Camera,
    ImagePicker,
    GlobalDataProvider,
    File,
    FileTransfer,
    Keyboard,
    HelperProvider,
    JPush,
    AppMinimize,
    BackButtonProvider,
    InAppBrowser,
    QRScanner,
    OpenNativeSettings
  ]
})
export class AppModule {}
