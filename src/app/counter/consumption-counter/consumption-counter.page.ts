import { Component, ViewChild, ElementRef, Renderer2, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import { CropperPosition, LoadedImage, ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@awesome-cordova-plugins/camera-preview/ngx';
import 'hammerjs';
import { OCR, OCRSourceType } from '@awesome-cordova-plugins/ocr/ngx';



@Component({
  selector: 'app-consumption-counter',
  templateUrl: './consumption-counter.page.html',
  styleUrls: ['./consumption-counter.page.scss'],
})

export class ConsumptionCounterPage {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent | any;
  ocrResult: string | undefined;
  worker: Tesseract.Worker | undefined;
  workerReady = false;
  image: any;
  showBody = true;
  cropPosition: CropperPosition = {
    x1: window.innerWidth * 0.14, 
    y1: window.innerHeight * 0.23, 
    x2: window.innerWidth * 0.14 + window.innerWidth * 0.8, // Increase the width to 80% of the window width
    y2: window.innerHeight * 0.23 + window.innerHeight * 0.08 // Decrease the height to 8% of the window height
  };
  numValues: string[] = [];
  num2Values: string[] = [];
  joinedValues: any;
  numbers: any[] = [0, 0, 0, 0, 0]; // Tableau pour stocker les nombres
  decimals: number[] = [0, 0, 0]; // Tableau pour stocker les décimales
  index = ['','','','','','','']; 
  imageChangedEvent: any = '';
  croppedImage: any = ''; 
  cameraActive: boolean = false;
  showCropper: boolean = false;
  imageStopped: boolean = false;
  modifiedImage: any;
  

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateCropPosition();
  }

  constructor(public navCtrl: NavController, 
              private route: Router, 
              private sanitizer: DomSanitizer, 
              private cameraPreview: CameraPreview,
              private ocr: OCR
              ) {
    this.loadWorker();
    this.updateCropPosition();
  }

  updateCropPosition() {
    this.cropPosition = {
      x1: window.innerWidth * 0.14, 
      y1: window.innerHeight * 0.23, 
      x2: window.innerWidth * 0.14 + window.innerWidth * 0.8, // Increase the width to 80% of the window width
      y2: window.innerHeight * 0.23 + window.innerHeight * 0.08 // Decrease the height to 8% of the window height
    };
  }

  openCamera() {
    const options: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'rear',
      tapPhoto: true,
      previewDrag: true,
      toBack: true,
      alpha: 1,
      storeToFile: false
    };
    this.cameraPreview.startCamera(options).then(
      (res) => {
        console.log(res);
        this.cameraActive = true;
        this.showBody = true;
      },
      (err) => {
        console.log(err);
      });
  }

  async loadWorker() {
      this.worker = await createWorker();
      await this.worker?.loadLanguage('eng');
      await this.worker?.initialize('eng');
  };

  async recognizeCropped(croppedImage: any) {
    const imageUrl = croppedImage.changingThisBreaksApplicationSecurity;
    const result = await this.ocr.recText(OCRSourceType.NORMFILEURL, imageUrl);
    console.log(result);
    this.ocrResult = result.toString().replace(/\D/g, "");
    const ocrDigits = this.ocrResult.split('');
    // Réinitialiser les tableaux des valeurs
    this.numValues = [];
    this.num2Values = [];
    // Remplir les valeurs des numValues
    if (ocrDigits && ocrDigits.length > 0) {
      for (let i = 0; i < 6; i++) {
        if (ocrDigits[i]) {
          this.numValues.push(ocrDigits[i]);
        } else {
          this.numValues.push('0');
          this.num2Values.push('0');
        }
      }
    }
    // Remplir les valeurs des num2Values
    if (ocrDigits && ocrDigits.length >= 6) {
      for (let i = 6; i < 9; i++) {
        if (ocrDigits[i]) {
          this.num2Values.push(ocrDigits[i]);
        } else {
          this.num2Values.push('0');
        }
      }
    }
    // Mettre à jour les valeurs des index utilisées pour les bindings des inputs
    for (let i = 0; i < this.numValues.length; i++) {
      this.index[i] = this.numValues[i];
    }
    for (let i = 0; i < this.num2Values.length; i++) {
      this.index[6 + i] = this.num2Values[i];
    }
  };

  async recognizeImages() {
    const result = await this.worker?.recognize(this.image);
    this.ocrResult = result?.data.text.replace(/\D/g, "");
    const ocrDigits = this.ocrResult?.split('');
    // Réinitialiser les tableaux des valeurs
    this.numValues = [];
    this.num2Values = [];
    // Remplir les valeurs des numValues
    if (ocrDigits && ocrDigits.length > 0) {
      for (let i = 0; i < 6; i++) {
        if (ocrDigits[i]) {
          this.numValues.push(ocrDigits[i]);
        } else {
          this.numValues.push('0');
          this.num2Values.push('0');
        }
      }
    }
    // Remplir les valeurs des num2Values
    if (ocrDigits && ocrDigits.length >= 6) {
      for (let i = 6; i < 9; i++) {
        if (ocrDigits[i]) {
          this.num2Values.push(ocrDigits[i]);
        } else {
          this.num2Values.push('0');
        }
      }
    }
    // Mettre à jour les valeurs des index utilisées pour les bindings des inputs
      for (let i = 0; i < this.numValues.length; i++) {
        this.index[i] = this.numValues[i];
      }
      for (let i = 0; i < this.num2Values.length; i++) {
        this.index[6 + i] = this.num2Values[i];
      }
  }   

  enterDigits() {
    this.navCtrl.navigateRoot('/input-comsuption');
  }

  addNumValue(value: string, index: number) {
    console.log(value);
    this.numValues[index] = value;
  }

  addNum2Value(value: string, index : number) {
    this.num2Values[index] = value;
  }

  getJoinedValues() {
    this.joinedValues = this.numValues.join('')+','+this.num2Values.join('');
    console.log(this.joinedValues);
  }

  navigation(url : String) {
    this.route.navigate(['/'+url]);
  }

  maFonction(code: any) {
    document.getElementById('code'+code);    
  }

  maFonction2(code: any) {
    this.index[code] = '';
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
   this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || '');
   console.log(this.croppedImage);
  }


  modifyImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    const image = new Image();
    image.src = this.image;
  
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
  
      // Draw the image on the canvas
      context?.drawImage(image, 0, 0);
  
      // Get the image data
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const data = imageData.data;
        
        // Convert each pixel to its negative value
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i]; // Red
          data[i + 1] = 255 - data[i + 1]; // Green
          data[i + 2] = 255 - data[i + 2]; // Blue
        }
        
        // Put the modified image data back onto the canvas
        context?.putImageData(imageData, 0, 0);
        
        // Get the base64 representation of the modified image
        const modifiedImageBase64 = canvas.toDataURL();
        
        // Set the croppedImage variable to the modified image
        this.image = modifiedImageBase64;
      }
    };
  }

  // modifyImage() {
  //   const canvas = document.createElement('canvas');
  //   const context = canvas.getContext('2d');
  
  //   const image = new Image();
  //   image.src = this.image;
  
  //   image.onload = () => {
  //     canvas.width = image.width;
  //     canvas.height = image.height;
  
  //     // Draw the image on the canvas
  //     context?.drawImage(image, 0, 0);
  
  //     // Get the image data
  //     const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
  //     if (imageData) {
  //       const data = imageData.data;
        
  //       // Apply thresholding
  //       for (let i = 0; i < data.length; i += 4) {
  //         const grayscale = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
  //         const binaryColor = grayscale < 128 ? 0 : 255;
  //         data[i] = binaryColor; // Red
  //         data[i + 1] = binaryColor; // Green
  //         data[i + 2] = binaryColor; // Blue
  //       }
        
  //       // Put the modified image data back onto the canvas
  //       context?.putImageData(imageData, 0, 0);
        
  //       // Get the base64 representation of the modified image
  //       const modifiedImageBase64 = canvas.toDataURL();
        
  //       // Set the croppedImage variable to the modified image
  //       this.image = modifiedImageBase64;
  //     }
  //   };
  // }

  imageLoaded(image: LoadedImage) {
    setTimeout(() => {
      this.cropPosition = {
        x1: window.innerWidth * 0.14, 
        y1: window.innerHeight * 0.23, 
        x2: window.innerWidth * 0.14 + window.innerWidth * 0.8, // Increase the width to 80% of the window width
        y2: window.innerHeight * 0.23 + window.innerHeight * 0.08 // Decrease the height to 8% of the window height
      };
    },2);
  }
  
  cropperReady() {
      // cropper ready
  }

  loadImageFailed() {
      // show message
  }

  crop () {
    if (this.imageCropper) {
      this.imageCropper.crop();
    }
  }

  async captureImage() {
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      width: 1280,
      height: 1280,
      quality: 85
    };

    this.cameraPreview.takePicture(cameraPreviewPictureOptions).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.modifyImage();
      setTimeout(() => this.crop(), 2000);
      this.stopCamera();
      this.showBody = true;
    }, (err) => {
      console.log(err);
      this.image = 'assets/img/test.jpg'; // fallback photo
    });
    this.showCropper = true;
  }

  async stopCamera() {
    this.cameraPreview.stopCamera();
    this.cameraActive = false;
    this.showBody = true;
    this.imageStopped = true;
  }
}



