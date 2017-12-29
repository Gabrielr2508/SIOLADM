import { Component } from '@angular/core';
import { NavController, App, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //public userDetails: any;
  public responseData: any;
  public dataSet: any;
  userToken = "";

  constructor(private network: Network,  private toastCtrl: ToastController, public navCtrl: NavController, public app: App, public authService: AuthServiceProvider) {
    this.dataSet = {
      barometer: "",
      dayRain: "",
      forecast: "",
      inHumidity: "",
      inTemperature: "",
      outHumidity: "",
      outTemperature: "",
      rainRate: "",
      readDate: "",
      windDirection: "",
      windSpeed: ""
    }
    this.getRead();
  }

  getRead() {
    if (this.checkConnection()) {
    this.authService.getData("read/last").then((result) => {
      this.responseData = result;
      // console.log(this.responseData);
      if(this.responseData){
        this.dataSet = this.responseData;
        console.log(this.dataSet);
      }
      else
        console.log("No access");
    }, (err) => {
      //Connection failed message
    });
  }
  else {
    this.presentToast("Sem conexão com a internet.");
  }
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.goToRoot();
  }

  logout() {
    //Api Token Logout 
    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });

    toast.present();
  }

  checkConnection() {
    if (this.network.type !== 'none'){
      console.log(this.network.type);
      return true;
  }
    else
      return false;
  }

}
