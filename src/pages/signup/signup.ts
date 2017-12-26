import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  signup() {
    //Api connections
    //this.navCtrl.push(TabsPage);
    if (this.userData.fullName && this.userData.password && this.userData.email) {
      this.authService.postData("fullName=" + this.userData.fullName + "&password=" + this.userData.password + "&email=" + this.userData.email, "auth/register").then((result) => {
        this.responseData = result;
        //console.log(this.responseData);
        localStorage.setItem('userData', JSON.stringify(this.responseData));
        this.navCtrl.push(Login);
      }, (err) => {
        //Connection failed message
      });
    }
    else {
      console.log("Give the complete user data");
    }
  }

  login() {
    this.navCtrl.push(Login);
  }
}
