import { Component } from '@angular/core';
import { NavController, ToastController, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Graph } from '../graph/graph';
import moment from 'moment';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public responseData: any;
  date = {
    initDate: "",
    endDate: "",
    initHour: "",
    endHour: ""
  }
  initString1: string;
  initString2: string;
  endString1: string;
  endString2: string;
  public dataSet: any;

  constructor(private network: Network, public navCtrl: NavController, public authService: AuthServiceProvider, private toastCtrl: ToastController, public app: App) {
    this.date.initHour = moment().format();
    this.date.initDate = moment().format();
    this.date.endHour = moment().format();
    this.date.endDate = moment().format();
  }

  getDataBetweenDates() {
    if (this.checkConnection()) {
      this.initString1 = moment(this.date.initDate).format('YYYY-MM-DD')
        + 'T'
        + moment(this.date.initHour).format('HH:mm:[00]Z');

      this.endString1 = moment(this.date.endDate).format('YYYY-MM-DD')
        + 'T'
        + moment(this.date.endHour).format('HH:mm:[00]Z');

      this.initString2 = moment.utc(this.initString1).format();
      this.endString2 = moment.utc(this.endString1).format();
      // console.log(this.initString1);
      // console.log(this.initString2);
      // console.log(this.endString1);
      // console.log(this.endString2);
      if (moment(this.endString2).isAfter(this.initString2)) {
        this.authService.getData("read/" + this.initString2 + "/" + this.endString2).then((result) => {
          this.responseData = result;
          // console.log(this.responseData);
          if (Object.keys(this.responseData).length !== 0) {
            this.dataSet = this.responseData;
            console.log(this.dataSet);
            this.navCtrl.push(Graph, {
              dataSet: this.dataSet
            });
          }
          else {
            console.log("No data");
            this.presentToast("Não há dados, selecione outro período.");
          }
        }, (err) => {
          //Connection failed message
        });
      }
      else {
        this.presentToast("A data/hora de início deve ser anterior à data/hora final. Por favor, selecione valores corretos.");
      }
    }
    else {
      this.presentToast("Sem conexão com a internet.");
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2500,
      position: 'top'
    });

    toast.present();
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    //Api Token Logout 
    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }

  checkConnection() {
    if (this.network.type !== 'none') {
      console.log(this.network.type);
      return true;
    }
    else
      return false;
  }
}  