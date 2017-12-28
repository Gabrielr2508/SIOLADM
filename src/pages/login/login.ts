import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TabsPage } from '../tabs/tabs';
import { Signup } from '../signup/signup';
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
      if (this.validateEmail(this.userData.email) && this.validatePassword(this.userData.password)) {
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
    }
    else {
      this.presentToast("Por favor, insira um email e uma senha válida.");
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

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.toLowerCase()))
      return true;
    else {
      this.presentToast("Por favor, insira um e-mail válido.");
      return false;
    }
  }

  validatePassword(pass) {
    if (pass.length > 5) {
      return true;
    }
    else {
      this.presentToast("A senha deve possuir pelo menos 6 caracteres.");
      return false;
    }
  }

  signup(){
    this.navCtrl.push(Signup);
  }

}
