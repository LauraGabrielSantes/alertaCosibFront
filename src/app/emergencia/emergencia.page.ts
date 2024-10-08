import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AppStateService } from 'src/services/app-state.service';
import { BotonService } from 'src/services/boton.service';

const TotalTime = 3;
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
//status
export class EmergenciaPage implements OnInit, OnDestroy {
  private intervalId: any = null;
  connectionStatus: boolean = false;
  countdown: number = TotalTime;
  private countdownInterval: any;
  isUam: boolean | null = null;
  constructor(
    private readonly appStateService: AppStateService,
    private readonly botonService: BotonService,
    private readonly router: Router,
  ) {}
  async ngOnInit() {
    this.connectionStatus = await this.botonService.checarComunicacion();
    this.isUam = await this.appStateService.getIsUam();
    await this.updateScreen();
    this.appStateService.isUam.subscribe(async (isUam) => {
      this.isUam = isUam;
      console.log('isUam es: ' + isUam);
      await this.updateScreen();
    });
  }

  ionViewWillEnter() {
    this.appStateService.changeTitle('Emergencia');

    const alertaActiva = this.appStateService.getIsActiveAlert();
    if (this.botonService.getStatusAlerta() !== null && alertaActiva) {
      this.router.navigate(['/send-more-info']);
    }
    this.updateScreen();
    this.startConnectionCheck();
    this.countdown = TotalTime;
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
    if (this.isUam === false) {
      this.setBlueBackground();
    }
  }

  private setDefaultBackground() {
    this.appStateService.defaultBackground();
  }

  private setDangerBackground() {
    this.appStateService.changeBackgroundDanger();
  }
  private setBlueBackground() {
    this.appStateService.changeBackgroundAzul();
  }
  isLoading = false;
  statusAlertaActive = false;
  private startConnectionCheck() {
    this.appStateService.statusAlerta.subscribe((status) => {
      this.statusAlertaActive = status != null;
    });
    const checkConnection = async () => {
      if (!this.isLoading && !this.statusAlertaActive) {
        this.connectionStatus = await this.botonService.checarComunicacion();
        await this.updateScreen();
        clearInterval(this.intervalId);
        const newInterval = this.connectionStatus ? 15000 : 1500; // 25 segundos o 1.5 segundos
        this.intervalId = setInterval(checkConnection, newInterval);
      }
    };
    this.intervalId = setInterval(checkConnection, 3000);
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
    if (this.countdown <= TotalTime) {
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
          this.countdown = TotalTime;
          clearInterval(aInterval);
        }
      }
    }, 600);
  }
  private enviarAlerta() {
    this.isLoading = true;
    try {
      this.botonService.sendAlert().catch((e) => {
        this.countdown = TotalTime;
      });

      const audio = new Audio('/assets/alert.mp3');
      audio.play();
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }
  cancelar() {
    this.botonService.cancelarAlerta();
    this.countdown = TotalTime;
  }
}
