import { Injectable } from '@angular/core';
import {
  Http, RequestOptionsArgs, Response, Headers, RequestMethod, RequestOptions,
  URLSearchParams
} from "@angular/http";
import {Observable} from "rxjs";
import {NativeServiceProvider} from "../native-service/native-service";

/*
  Generated class for the HttpServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpServiceProvider {

  constructor(public http: Http, public nativeService: NativeServiceProvider) {
  }

  httpOptions = {
    headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})
  };

  //Post请求
  public post(url: string, body: any = null, loading: boolean = true): Observable<Response> {
    //let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let headers = this.httpOptions.headers;
    return this.request(url, loading, new RequestOptions({
      method: RequestMethod.Post,
      body: body,
      headers: headers
    }))
  }

  //PostJson请求
  public postJson(url: string, body: any = null, loading: boolean = true): Observable<Response> {
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.request(url, loading, new RequestOptions({
      method: RequestMethod.Post,
      body: body,
      headers: headers
    }))
  }

  //get请求
  public get(url: string, paramMap: any = null, loading: boolean = true): Observable<Response> {
    return this.request(url, loading, new RequestOptions({
      method: RequestMethod.Get,
      search: HttpServiceProvider.buildURLSearchParams(paramMap)
    }));
  }

  /**
   * 将对象转为查询参数
   * @param paramMap
   * @returns {URLSearchParams}
   */
  private static buildURLSearchParams(paramMap): URLSearchParams {
    let params = new URLSearchParams();
    if (!paramMap) {
      return params;
    }
    for (let key in paramMap) {
      let val = paramMap[key];
      if (val instanceof Date) {
        //val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
      }
      params.set(key, val);
    }
    return params;
  }


  public request(url: string, loading: boolean, options: RequestOptionsArgs): Observable<Response> {
    return Observable.create((observer) => {
      //请求前
      if (loading == true) {
        this.nativeService.showLoading("正在加载...");
      }
      this.http.request(url, options).subscribe(res => {
        //请求成功
        this.nativeService.hideLoading();
        observer.next(res);
      }, err => {
        this.requestFailed(url, options, err);
      })
    })
  }

  private requestFailed(url: string, options: RequestOptionsArgs, err) {
    this.nativeService.hideLoading();
    console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', err);
    let msg = '请求发生异常', status = err.status;
    if (!this.nativeService.isConnecting()) {//判断是否有网络
      msg = '请求失败，请连接网络';
    } else {
      if (status === 0) {
        msg = '请求失败，请求响应出错';
      } else if (status === 401) {
        msg = '会话超时,请重新登录';
      } else if (status === 404) {
        msg = '请求失败，未找到请求地址';
      } else if (status === 500) {
        msg = '请求失败，服务器出错，请稍后再试';
      }
    }
    this.nativeService.showToast(msg);
  }
}
