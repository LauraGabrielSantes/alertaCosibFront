import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { DatosUsuario } from 'src/domain/alerta';
import { AppStateService } from 'src/services/app-state.service';
import { BotonService } from 'src/services/boton.service';

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
    private readonly appStateService: AppStateService,
    private readonly botonService: BotonService,
  ) {}
  datosUsuario: DatosUsuario = {
    nombreCompleto: '',
    correoElectronico: '',
    matricula: '',
    numeroTelefono: '',
  };
  ionViewWillEnter() {
    const datosUsuario = this.appStateService.getDatosUsuario();
    if (datosUsuario !== null) {
      this.datosUsuario = datosUsuario;
    }
    this.appStateService.changeTitle('Configuración');
    this.appStateService.defaultBackground();
  }
  guardar() {
    this.botonService.saveDatosUsuario(this.datosUsuario).then(() => {
      this.appStateService.sendMessageModal({
        title: 'Guardado',
        message: 'Datos guardados correctamente',
      });
    });
  }
}
