import { Component, OnInit } from '@angular/core';
import { HomePage } from '../home/home.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.page.html',
  styleUrls: ['./thermostat.page.scss'],
})
export class ThermostatPage implements OnInit {

  lastTemp = 0;
  desiratedTemp = 0;
  power:boolean = true;

  component = HomePage;
  constructor(private route : Router) { }

  ngOnInit() {
  }

  upTemp() {
    if (this.power) {
      this.desiratedTemp++;
    } 
  }

  downTemp() {
    if (this.power) {
      this.desiratedTemp--;
    } 
  }

  shutDown() {
    this.power = !this.power;
    if (!this.power) {
      document.getElementById("btn-power")?.setAttribute("class", "fa-solid fa-power-off fa-3x");
    }
    else {
      document.getElementById("btn-power")?.setAttribute("class", "fa-solid fa-power-off");
    }
  }
}

