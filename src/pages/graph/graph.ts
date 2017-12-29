import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
/**
 * Generated class for the GraphPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html',
})
export class Graph {
  //@ViewChild('barCanvas') barCanvas;
  @ViewChild('radarCanvas') radarCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  dataSet: any;

  lineChart: any;
  radarChart: any;

  colors: any;

  height: any;

  dataset1: any;
  dataset2: any;
  dataset3: any;
  dataset4: any;
  windData: any;

  constructor(public plt: Platform, public navCtrl: NavController, public navParams: NavParams, private screenOrientation: ScreenOrientation, public app: App) {
    //initialize canvas height
    this.height = this.plt.height() / 2;

    //get data from previous view
    this.dataSet = navParams.get('dataSet');

    //initialize dataset for radar graph
    this.dataset1 = [0, 0, 0, 0, 0, 0, 0, 0];
    this.dataset2 = [0, 0, 0, 0, 0, 0, 0, 0];
    this.dataset3 = [0, 0, 0, 0, 0, 0, 0, 0];
    this.dataset4 = [0, 0, 0, 0, 0, 0, 0, 0];
    
    this.windData = this.iterateWindData();

    this.colors = {
      1: "#ff0000", //red
      2: "#00ff00", //green
      3: "#0000ff", //blue
      4: "#000000", //black
      5: "#ffa123", //
      6: "#ff42ab", //
      7: "#00ffff", //cian
      8: "#ffaa00", //orange
      9: "#ffff00", //yellow
      10: "#ff00ff", //magenta
    }

  }

  ionViewDidLoad() {
    //changinf heigth for line chart
    if (this.plt.is('android')) {
      this.screenOrientation.onChange().subscribe(
        () => {
          if (this.plt.isPortrait()) {
            this.height = this.plt.height() / 2;
            this.lineChart.resize();
          }
          else {
            this.height = this.plt.height();
            this.lineChart.resize();
          }
        });
    }

    //instantiate line chart
    let mySymbols = ['hPa', 'ºC', '%', 'ºC', '%', 'mm', 'mm', ''];

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: this.iterateData('readDate'),
        datasets: this.iterateDataset(),
      },
      options: {
        legend: {
          position: 'bottom'
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel + " " + mySymbols[tooltipItem.datasetIndex];
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }

    });

    this.radarChart = new Chart(this.radarCanvas.nativeElement, {
      type: 'radar',
      data: {
        labels: ['Norte', 'Nordeste', 'Leste', 'Sudeste', 'Sul', 'Sudoeste', 'Oeste', 'Noroeste'],
        datasets: [
          {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "rgba(255, 0, 0, 1.0)",
            pointBackgroundColor: "rgba(255, 0, 0, 1.0)",
            data: this.windData[0],
            label: '0-9 Km/h'
          },
          {
            backgroundColor: "rgba(0, 255, 0, 0.2)",
            borderColor: "rgba(0, 255, 0, 1.0)",
            pointBackgroundColor: "rgba(0, 255, 0, 1.0)",
            data: this.windData[1],
            label: '10-19 Km/h',
          },
          {
            backgroundColor: "rgba(255, 0, 255, 0.2)",
            borderColor: "rgba(255, 0, 255, 1.0)",
            pointBackgroundColor: "rgba(255, 0, 255, 1.0)",
            data: this.windData[2],
            label: '20-29 Km/h'
          },
          {
            backgroundColor: "rgba(0, 0, 255, 0.2)",
            borderColor: "rgba(0, 0, 255, 1.0)",
            pointBackgroundColor: "rgba(0, 0, 255, 1.0)",
            data: this.windData[3],
            label: '>29 Km/h'
          }
        ]
      },
      options: {
        tooltips: {
          mode: 'index',
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    })

  }
  //format data to line graph 
  iterateData(variable) {
    let dataArray = new Array();

    //format date to locale for x axys label
    if (variable === 'readDate') {
      let options = {
        timeZone: 'America/Fortaleza',
        hour: '2-digit',
        minute: '2-digit',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };

      for (var i = 0; i < this.dataSet.length; i++) {
        dataArray.push(new Date(this.dataSet[i][variable]).toLocaleString([], options));
      }

      return dataArray;
    }

    //format other data type to 2 decimal digits
    for (var j = 0; j < this.dataSet.length; j++) {
      dataArray.push(this.dataSet[j][variable].toFixed(2));
    }

    return dataArray;
  }

  //generate dataset for line chart
  iterateDataset() {
    let dataset = new Array();

    for (var i = 0; i < Object.keys(this.dataSet[0]).length; i++) {
      //remove unused data
      if (Object.keys(this.dataSet[0])[i].toString() !== "readDate"
        && Object.keys(this.dataSet[0])[i].toString() !== "_id"
        && Object.keys(this.dataSet[0])[i].toString() !== "__v"
        && Object.keys(this.dataSet[0])[i].toString() !== "windSpeed"
        && Object.keys(this.dataSet[0])[i].toString() !== "windDirection"
      ) {

        //console.log(Object.keys(this.dataSet[0])[i]);
        // console.log("color($colors, " + i + ")");
        dataset.push(
          {
            label: Object.keys(this.dataSet[0])[i].toString(),
            fill: false,
            lineTension: 0.1,
            backgroundColor: this.colors[i],
            borderColor: this.colors[i],
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: this.colors[i],
            pointBackgroundColor: this.colors[i],
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: this.colors[i],
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.iterateData(Object.keys(this.dataSet[0])[i].toString()),
            spanGaps: false,
          }
        );
      }
    }
    //console.log(dataset);
    return dataset;
  }

  iterateWindData() {
    let windDataset = new Array();

    for (var j = 0; j < this.dataSet.length; j++) {
      //NE direction
      if (this.dataSet[j]['windDirection'] > 22.5 && this.dataSet[j]['windDirection'] <= 67.5) {
        this.verifySpeed(1, j);
      }
      //E direction
      else if (this.dataSet[j]['windDirection'] > 67.5 && this.dataSet[j]['windDirection'] <= 112.5) {
        this.verifySpeed(2, j);
      }
      //SE direction
      else if (this.dataSet[j]['windDirection'] > 112.5 && this.dataSet[j]['windDirection'] <= 157.5) {
        this.verifySpeed(3, j);
      }
      //S direction
      else if (this.dataSet[j]['windDirection'] > 157.5 && this.dataSet[j]['windDirection'] <= 202.5) {
        this.verifySpeed(4, j);
      }
      //SO direction
      else if (this.dataSet[j]['windDirection'] > 202.5 && this.dataSet[j]['windDirection'] <= 247.5) {
        this.verifySpeed(5, j);
      }
      //O direction
      else if (this.dataSet[j]['windDirection'] > 247.5 && this.dataSet[j]['windDirection'] <= 292.5) {
        this.verifySpeed(6, j);
      }
      //NO direction
      else if (this.dataSet[j]['windDirection'] > 292.5 && this.dataSet[j]['windDirection'] <= 337.5) {
        this.verifySpeed(7, j);
      }
      //N direction
      else {
        this.verifySpeed(0, j);
      }
    }
    windDataset.push(this.dataset1);
    windDataset.push(this.dataset2);
    windDataset.push(this.dataset3);
    windDataset.push(this.dataset4);

    console.log(windDataset);

    return windDataset;
  }

  verifySpeed(i, j) {
    if (this.dataSet[j]['windSpeed'] <= 9) {
      if (this.dataset1[i] < this.dataSet[j]['windSpeed'])
        this.dataset1[i] = this.dataSet[j]['windSpeed'].toFixed(2);
    }
    else if (this.dataSet[j]['windSpeed'] > 9 && this.dataSet[j]['windSpeed'] <= 19) {
      if (this.dataset2[i] < this.dataSet[j]['windSpeed']) 
        this.dataset2[i] = this.dataSet[j]['windSpeed'].toFixed(2);
    }
    else if (this.dataSet[j]['windSpeed'] > 19 && this.dataSet[j]['windSpeed'] <= 29) {
      if (this.dataset3[i] < this.dataSet[j]['windSpeed'])
        this.dataset3[i] = this.dataSet[j]['windSpeed'].toFixed(2);
    }
    else {
      if (this.dataset4[i] < this.dataSet[j]['windSpeed'])
        this.dataset4[i] = this.dataSet[j]['windSpeed'].toFixed(2);
    }
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

}
