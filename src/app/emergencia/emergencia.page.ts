import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AppStateService } from 'src/app-state.service';

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
export class EmergenciaPage implements OnDestroy {
  private intervalId: any = null;
  private connectionStatus: boolean = false;
  texto = 'no hay conexión';

  constructor(private readonly appStateService: AppStateService) {}

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
    this.texto = this.connectionStatus ? 'hay conexión' : 'no hay conexión';
    this.connectionStatus
      ? this.setGrayBackground()
      : this.setDangerBackground();
    this.appStateService.stopLoading();
  }

  private setGrayBackground() {
    this.appStateService.changeBackgroundGris();
  }

  private setDangerBackground() {
    this.appStateService.changeBackgroundDanger();
  }

  private async checkConnection(): Promise<void> {
    this.connectionStatus = true;
  }

  private startConnectionCheck() {
    this.intervalId = setInterval(async () => {
      await this.checkConnection();
      await this.updateScreen();
    }, 1000);
  }

  private cleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.appStateService.stopLoading();
  }
  sendAlert() {
    this.appStateService.startAlert();
  }
  apagarAlerta() {
    this.appStateService.stopAlert();
  }
}
