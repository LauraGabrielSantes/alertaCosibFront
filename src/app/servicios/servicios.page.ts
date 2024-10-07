import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AppStateService } from 'src/services/app-state.service';
@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
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
export class ServiciosPage {
  constructor(
    private readonly appStateService: AppStateService, // Inyecta el servicio
    private readonly router: Router,
  ) {}
  opcionActiva = false;
  ionViewWillEnter() {
    this.appStateService.changeTitle('Servicios');
    this.appStateService.defaultBackground();
  }
  async navigateTo(page: string) {
    await this.router.navigate([`/${page}`]);
  }

  goTelefono(numero: String) {
    let telefono = 'tel:' + numero;
    window.location.href = telefono;
  }
  goExternalLink(link: String) {
    window.open(link.toString(), '_blank');
  }
}
