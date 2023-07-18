import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsumptionCounterPageRoutingModule } from './consumption-counter-routing.module';

import { ConsumptionCounterPage } from './consumption-counter.page';
import { ImageCropperModule } from 'ngx-image-cropper';
//import { CameraPreview } from '@awesome-cordova-plugins/camera-preview/ngx';
import { CameraPreview } from '@capacitor-community/camera-preview';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumptionCounterPageRoutingModule,
    ImageCropperModule,
  ],
  providers: [],
  declarations: [ConsumptionCounterPage]
})
export class ConsumptionCounterPageModule {}
