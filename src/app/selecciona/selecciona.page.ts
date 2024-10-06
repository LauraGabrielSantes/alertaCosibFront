import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AppStateService } from 'src/app-state.service';
import { BotonService } from 'src/services/boton.service';

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
  ],
})
export class SeleccionaPage implements OnInit {
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
}
