import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AppStateService } from 'src/app-state.service';
import { BotonService } from 'src/services/boton.service';

@Component({
  selector: 'app-emergencia',
  templateUrl: './emergencia.page.html',
  styleUrls: ['./emergencia.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
  ],
})
export class EmergenciaPage implements OnInit, OnDestroy {
  private intervalId: any = null;

  connectionStatus: boolean = false;
  readonly TotalTime = 3;
  countdown: number = 3;
  private countdownInterval: any;
  constructor(
    private readonly appStateService: AppStateService,
    private readonly botonService: BotonService,
  ) {}
  async ngOnInit() {
    this.connectionStatus = await this.botonService.checarComunicacion();
    await this.updateScreen();
  }

  ionViewWillEnter() {
    this.appStateService.changeTitle('Emergencia');
    this.updateScreen();
    this.startConnectionCheck();
  }

  ionViewWillLeave() {
    this.cleanup();
  }

  ngOnDestroy() {
    this.cleanup();
  }
  private async updateScreen() {
    this.connectionStatus
      ? this.setDefaultBackground()
      : this.setDangerBackground();
  }

  private setDefaultBackground() {
    this.appStateService.defaultBackground();
  }

  private setDangerBackground() {
    this.appStateService.changeBackgroundDanger();
  }

  private startConnectionCheck() {
    this.intervalId = setInterval(async () => {
      this.connectionStatus = await this.botonService.checarComunicacion();
      await this.updateScreen();
    }, 1000);
  }

  private cleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  call911() {
    window.location.href = 'tel:911';
  }
  startTimer() {
    if (this.countdown == 0) {
      return;
    }
    if (this.countdown == 1) {
      this.countdown--;
      this.enviarAlerta();
      return;
    }
    if (this.countdown <= this.TotalTime) {
      this.countdown--;
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 1) {
          this.countdown--;
        } else {
          this.countdown--;
          clearInterval(this.countdownInterval);
          this.enviarAlerta();
        }
      }, 800);
    } else {
      this.countdown--;
      const time = this.countdown;
      this.countdownInterval = setInterval(() => {
        if (this.countdown == time) {
          this.resetTimer();
        }
      }, 800);
    }
  }
  resetTimer() {
    if (this.countdown == 0) {
      return;
    }
    clearInterval(this.countdownInterval);
    const time = this.countdown;
    const aInterval = setInterval(() => {
      if (this.countdown != 0) {
        if (this.countdown >= time) {
          this.countdown = this.TotalTime;
          clearInterval(aInterval);
        }
      }
    }, 600);
  }
  enviarAlerta() {
    this.botonService.sendAlert();
  }
}
