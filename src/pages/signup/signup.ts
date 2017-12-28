import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
//import { TabsPage } from '../tabs/tabs';
import { Login } from '../login/login';
/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {
  responseData: any;
  userData = {
    fullName: "",
    password: "",
    email: ""
  };

  // 'username='+$scope.username+'&password='+$scope.password
  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public authService: AuthServiceProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  signup() {
    //Api connections
    //this.navCtrl.push(TabsPage);
    if (this.userData.fullName && this.userData.password && this.userData.email) {
      if (this.validateName(this.userData.fullName) && this.validateEmail(this.userData.email) && this.validatePassword(this.userData.password)) {
        this.authService.postData("fullName=" + this.userData.fullName + "&password=" + this.userData.password + "&email=" + this.userData.email, "auth/register").then((result) => {
          this.responseData = result;
          //console.log(this.responseData);
          localStorage.setItem('userData', JSON.stringify(this.responseData));
          if(this.responseData){
            this.presentToast("Usuário cadastrado. Por favor, faça login.");
            this.navCtrl.push(Login);
          }
        }, (err) => {
          //Connection failed message
        });
      }
    }
    else {
     this.presentToast("Insira os dados completos do usuário.");
    }
  }

  login() {
    this.navCtrl.push(Login);
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
      this.presentToast("Por favor, insira um e-email válido.");
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

  validateName(name) {
    var re = /^[A-Za-z\s]+$/
    if (re.test(name))
      return true;
    else {
      this.presentToast("Por favor, insira um nome válido.");
      return false;
    }
  }
}
