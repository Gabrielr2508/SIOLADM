import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //public userDetails: any;
  public responseData: any;
  public dataSet: any;
  userToken = "";

  constructor(public navCtrl: NavController, public app: App, public authService: AuthServiceProvider) {
    //const data = JSON.parse(localStorage.getItem('userData'));
    //this.userDetails = data;
    //this.userToken = this.userDetails.token;
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
    //this.authService.getData(this.userToken, "read").then((result) => {
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

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    //Api Token Logout 
    localStorage.clear();
    if(!localStorage.getItem('userData')){
      console.log(this.app.getRootNavById('n4'));
    }
    setTimeout(() => this.backToWelcome(), 1000);
    
    //this.backToWelcome();
  }

}
