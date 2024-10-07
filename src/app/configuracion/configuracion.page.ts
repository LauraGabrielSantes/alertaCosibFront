import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
  IonInput,
  IonText,
} from '@ionic/angular/standalone';
import { AppStateService } from 'src/app-state.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonList,
    IonInput,
    IonText,
  ],
})
export class ConfiguracionPage {
  constructor(
    private readonly appStateService: AppStateService, // Inyecta el servicio
  ) {}
  ionViewWillEnter() {
    this.appStateService.changeTitle('Configuración');
    this.appStateService.defaultBackground();
  }

 

}
