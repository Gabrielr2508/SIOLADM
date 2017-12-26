import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  responseData: any;
  userData = {
    password: "",
    email: ""
  };

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  login() {
    //Api connections
    if (this.userData.password && this.userData.email) {
      this.authService.postData("password=" + this.userData.password + "&email=" + this.userData.email, "auth/login").then((result) => {
        this.responseData = result;
        if (this.responseData) {
          localStorage.setItem('userData', JSON.stringify(this.responseData));
          this.navCtrl.push(TabsPage);
        }
      }, (err) => {
        //Connection failed message
      });
    }
    else {
      this.presentToast("Give user email and password.");
    }
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
