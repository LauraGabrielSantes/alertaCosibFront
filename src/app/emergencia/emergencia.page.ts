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
  private intervalId: any = null;
  private connectionStatus: boolean = false;
  texto = 'no hay conexión';
  constructor(private readonly appStateService: AppStateService) {
    this.appStateService.changeBackgroundDanger();
  }

  ionViewWillEnter() {
    this.appStateService.changeTitle('Emergencia');
    this.pintaPantalla();
    this.intervalId = setInterval(async () => {
      await this.checarConexion();
      await this.pintaPantalla();
    }, 1000);
  }

  private async pintaPantalla() {
    if (this.connectionStatus) {
      this.pintaHayConexion();
      this.texto = 'hay conexión';
    } else {
      this.pintaNoHayConexion();
      this.texto = 'no hay conexión';
    }
    this.appStateService.stopLoading();
  }

  private pintaHayConexion() {
    this.appStateService.changeBackgroundGris();
  }
  private pintaNoHayConexion() {
    this.appStateService.changeBackgroundDanger();
  }

  private async checarConexion(): Promise<boolean> {
    this.connectionStatus = true;
    return true;
  }

  private clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  ionViewWillLeave() {
    this.clearInterval();
    this.appStateService.stopLoading();
  }

  ngOnDestroy() {
    this.clearInterval();
    this.appStateService.stopLoading();
  }
}
