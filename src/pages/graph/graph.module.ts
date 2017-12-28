import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Graph } from './graph';

@NgModule({
  declarations: [
    Graph,
  ],
  imports: [
    IonicPageModule.forChild(Graph),
  ],
})
export class GraphPageModule {}
