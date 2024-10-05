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

  constructor(private readonly appStateService: AppStateService) {
    this.appStateService.changeTitle('Emergencia');
  }

  ionViewWillEnter() {
    this.appStateService.startLoading();
    // Pruebo cada 3 segundos si hay conexión

    this.appStateService.changeTitle('Emergencia');
    // Función para checar la conexión y cambiar el fondo
    const checkConnection = async () => {
      if (await this.checarConexion()) {
        this.appStateService.changeBackgroundGris();
      } else {
        this.appStateService.changeBackgroundDanger();
      }
    };

    // Checar la conexión inmediatamente
    checkConnection();
    this.intervalId = setInterval(() => {
      checkConnection();
      this.appStateService.stopLoading();
    }, 3000);
  }

  ionViewWillLeave() {
    // Al salir, paro el intervalo
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    // Asegurarse de limpiar el intervalo si el componente se destruye
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async checarConexion(): Promise<boolean> {
    return false; // Ejemplo de retorno
  }
}
