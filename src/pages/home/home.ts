import { Component } from '@angular/core';
import { NavController, App, ToastController, LoadingController } from 'ionic-angular';
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
  direction: string;
  actualDate: string;
  loading: any;

  constructor(private network: Network, private toastCtrl: ToastController, public navCtrl: NavController, public app: App, public authService: AuthServiceProvider, public loadingCtrl: LoadingController) {
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
    this.actualDate = "0000-00-00T00:00:00.000Z";
    this.getRead();
  }

  getRead() {
    if (this.checkConnection()) {
      this.presentLoadingDefault();
      this.authService.getData("read/last").then((result) => {
        this.responseData = result;
        // console.log(this.responseData);
        if (this.responseData) {
          if (this.responseData.readDate !== this.actualDate) {
            this.dataSet = this.responseData;
            this.windDirection();
            this.actualDate = this.dataSet.readDate;
            //console.log(this.dataSet);
            this.loading.dismiss();
          }
          else
            this.loading.dismiss();
            this.presentToast("Esses são os dados mais atuais.");
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
    if (this.network.type !== 'none') {
      console.log(this.network.type);
      return true;
    }
    else
      return false;
  }

  windDirection() {
    //NE direction
    if (this.dataSet.windDirection > 22.5 && this.dataSet.windDirection <= 67.5) {
      this.direction = "Nordeste";
    }
    //E direction
    else if (this.dataSet.windDirection > 67.5 && this.dataSet.windDirection <= 112.5) {
      this.direction = "Leste";
    }
    //SE direction
    else if (this.dataSet.windDirection > 112.5 && this.dataSet.windDirection <= 157.5) {
      this.direction = "Sudeste";
    }
    //S direction
    else if (this.dataSet.windDirection > 157.5 && this.dataSet.windDirection <= 202.5) {
      this.direction = "Sul";
    }
    //SO direction
    else if (this.dataSet.windDirection > 202.5 && this.dataSet.windDirection <= 247.5) {
      this.direction = "Sudoeste";
    }
    //O direction
    else if (this.dataSet.windDirection > 247.5 && this.dataSet.windDirection <= 292.5) {
      this.direction = "Oeste";
    }
    //NO direction
    else if (this.dataSet.windDirection > 292.5 && this.dataSet.windDirection <= 337.5) {
      this.direction = "Noroeste";
    }
    //N direction
    else {
      this.direction = "Norte";
    }
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde...',
    });
    this.loading.present();
  }
}
