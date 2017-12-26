import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

let apiUrl = "https://vantage-api.herokuapp.com/";
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor(public http: HttpClient, private toastCtrl: ToastController) {
    console.log('Hello AuthServiceProvider Provider');
  }

  postData(credentials, type){
    //console.log(credentials);
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      this.http.post(apiUrl+type, credentials, {headers: headers}).subscribe(res =>{
        resolve(res);
      }, (err) =>{
        reject(err);
        this.presentToast(err.status + ": " + err.statusText);
      });
    });
  }

  //getData(credentials, type){
  getData(type){
    return new Promise((resolve, reject) => {
      let headers = {
        'Content-Type': 'application/json',
        //'Authorization': "JWT " + credentials
      };
      //console.log("crendenciais= " + credentials);
      this.http.get(apiUrl+type, {headers: headers}).subscribe(res =>{
        resolve(res);
      }, (err) =>{
        reject(err);
        this.presentToast(err.status + ": " + err.statusText);
      });
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });

    toast.present();
  }


}
