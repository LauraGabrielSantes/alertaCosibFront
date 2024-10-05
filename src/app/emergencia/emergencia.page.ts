import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
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
  ],
})
export class EmergenciaPage implements OnDestroy {
  private intervalId: any;
  private connectionStatus: boolean = false;

  constructor(private readonly appStateService: AppStateService) {}

  ionViewWillEnter() {
    this.appStateService.changeTitle('Emergencia');

    if (!this.connectionStatus) {
      this.appStateService.startLoading();
    }

    this.intervalId = setInterval(() => {
      this.checkConnection();
    }, 3000);
  }

  ionViewWillLeave() {
    this.clearInterval();
    this.appStateService.stopLoading();
  }

  ngOnDestroy() {
    this.clearInterval();
    this.appStateService.stopLoading();
  }

  private async checkConnection() {
    if (await this.checarConexion()) {
      this.appStateService.changeBackgroundGris();
    } else {
      this.appStateService.changeBackgroundDanger();
    }
    this.appStateService.stopLoading();
  }

  private clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async checarConexion(): Promise<boolean> {
    this.connectionStatus = false;
    return false; // Ejemplo de retorno
  }
}
