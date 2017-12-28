import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
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
  //@ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  dataSet: any;

  //barChart: any;
  //doughnutChart: any;
  lineChart: any;

  colors: any;

  constructor(public plt: Platform, public navCtrl: NavController, public navParams: NavParams, private screenOrientation: ScreenOrientation) {
    this.dataSet = navParams.get('dataSet');

    this.colors = {
      1: "#ff06d6",
      2: "#00a15e",
      3: "#fbff06",
      4: "#000000",
      5: "#ff0000",
      6: "#ff7b00",
      7: "#2f91be",
      8: "#6e00b8",
      9: "#9e8a16",
      10: "#1606ff",
    }
    //setTimeout(() => console.log(this.iterateData('readDate')), 1000);
  }

  ionViewDidLoad() {
    if (this.plt.is('android')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

      setTimeout(() => this.screenOrientation.unlock(), 1000);
    }

    //console.log(this.plt.is('android'));
   

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
          mode: 'index'
        }
      }

    });

  }

  iterateData(variable) {
    let dataArray = new Array();

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

    for (var j = 0; j < this.dataSet.length; j++) {
      dataArray.push(this.dataSet[j][variable].toFixed(2));
    }

    return dataArray;
  }

  iterateDataset() {
    let dataset = new Array();

    for (var i = 0; i < Object.keys(this.dataSet[0]).length; i++) {

      if (Object.keys(this.dataSet[0])[i].toString() !== "readDate"
        && Object.keys(this.dataSet[0])[i].toString() !== "_id"
        && Object.keys(this.dataSet[0])[i].toString() !== "__v") {

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

}
