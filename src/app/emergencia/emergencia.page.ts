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
  private connectionStatus: boolean = false;

  constructor(private readonly appStateService: AppStateService) {}
  async ngOnInit() {
    await this.checkConnection();
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
    this.appStateService.stopLoading();
  }

  private setDefaultBackground() {
    this.appStateService.defaultBackground();
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
