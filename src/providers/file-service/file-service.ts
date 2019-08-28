import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {FileObj} from "../../model/FileObj";
import {HttpServiceProvider} from "../http-service/http-service";
import {Storage} from "@ionic/storage";
import {ConfigServiceProvider} from "../config-service/config-service";
import {NativeServiceProvider} from "../native-service/native-service";
import {GlobalDataProvider} from "../global-data/global-data";
import {FileTransferObject, FileTransfer,FileUploadOptions} from "@ionic-native/file-transfer";

/*
  Generated class for the FileServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileServiceProvider {

  constructor(public http: HttpClient,public httpService:HttpServiceProvider,public storage:Storage,
              public config:ConfigServiceProvider,public nativeService:NativeServiceProvider,
              public globalData:GlobalDataProvider,public transfer:FileTransfer) {
    console.log('Hello FileServiceProvider Provider');
  }

  //单张图片/单个视频上传
  upload(fileObjList: FileObj[],evt_code,callback){
    let resultnumber=0;
    for (const fileObj of fileObjList) {
      var filename = fileObj.origPath.substring(fileObj.origPath.lastIndexOf("/")+1)
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
        fileKey: 'myfiles',
        fileName: filename,
        headers: {
        }
      }
      this.nativeService.showLoading("正在上传...");

      fileTransfer.upload(fileObj.origPath,this.config.url+"file/evtupload?evt_code="+evt_code, options)
        .then((res) => {
          let data = JSON.parse(res.response);
          if(data['resultCode']==1){
            this.nativeService.hideLoading();
            this.nativeService.showToast(data['message']);
            resultnumber =resultnumber+1;
            if(fileObjList.length==resultnumber){
              callback(resultnumber);
            }
          }else {
            this.nativeService.hideLoading();
            this.nativeService.showToast(data['message']);
            callback(1);
          }
        }, (err) => {
          // error
          this.nativeService.showToast("上传失败")
          this.nativeService.hideLoading();
        })
    }


  }
}
