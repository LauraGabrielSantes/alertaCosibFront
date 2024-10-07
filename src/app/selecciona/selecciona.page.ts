import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AppStateService } from 'src/app-state.service';
import { BotonService } from 'src/services/boton.service';
import { TipoAlerta } from '../domain/tipo-alerta';

@Component({
  selector: 'app-selecciona',
  templateUrl: './selecciona.page.html',
  styleUrls: ['./selecciona.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
  ],
})
export class SeleccionaPage implements OnInit {
  TipoAlerta = TipoAlerta;
  constructor(
    private readonly appStateService: AppStateService,
    private readonly botonService: BotonService,
  ) {}
  ngOnInit() {}
  ionViewWillEnter() {
    this.appStateService.changeTitle('Botón de Emergencia');
    this.appStateService.changeBackgroundGris();
  }
  cancelar() {
    this.botonService.cancelarAlerta();
  }
  seleccionar(tipoAlertaStr: string) {
    let tipo: TipoAlerta;
    switch (tipoAlertaStr) {
      case 'Medica':
        tipo = TipoAlerta.MEDICA;
        break;
      case 'Seguridad':
        tipo = TipoAlerta.SEGURIDAD;
        break;
      case 'Violencia de género':
        tipo = TipoAlerta.VIOLENCIA;
        break;
      case 'Otra':
        tipo = TipoAlerta.OTRA;
        break;
      default:
        tipo = TipoAlerta.OTRA;
        break;
    }
    this.botonService.seleccionarTipoAlerta(tipo);
  }
}
