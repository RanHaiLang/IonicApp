import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalDataProvider {

  private _userId: string; // 用户id
  private _username: string; // 用户名
  private _user; // 用户详细信息

  private _token: string; // token

  // 设置http请求是否显示loading,注意:设置为true,接下来的请求会不显示loading,请求执行完成会自动设置为false
  private _showLoading = true;

  // 是否启用文件缓存
  private _enabledFileCache = false;

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get user() {
    return this._user;
  }

  set user(value) {
    this._user = value;
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get showLoading(): boolean {
    return this._showLoading;
  }

  set showLoading(value: boolean) {
    this._showLoading = value;
  }

  get enabledFileCache(): boolean {
    return this._enabledFileCache;
  }

  set enabledFileCache(value: boolean) {
    this._enabledFileCache = value;
  }
}
