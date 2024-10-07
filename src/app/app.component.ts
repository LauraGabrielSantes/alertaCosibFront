import { CommonModule } from '@angular/common';
import { Device } from '@capacitor/device';

import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonNote,
  IonRouterLink,
  IonRouterOutlet,
  IonSpinner,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  MenuController,
} from '@ionic/angular/standalone';
import { StatusAlerta, TipoAlerta } from 'src/domain/alerta';
import { AppStateService } from 'src/services/app-state.service';
import { BotonService } from 'src/services/boton.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonButton,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    IonLoading,
    IonSpinner,
  ],
})
export class AppComponent implements OnInit {
  TipoAlerta = TipoAlerta;
  tipoAlerta: TipoAlerta | null = null;

  // Propiedades para almacenar el título y el fondo
  helpBubbleExpanded = false;
  pageTitle: string = ''; // Título inicial
  backgroundClass: string = 'background-default'; // Clase de fondo inicial
  isLoading = false;
  isAlertActive;
  StatusAlerta = StatusAlerta;
  status: StatusAlerta | null = null;

  constructor(
    private readonly router: Router,
    private readonly menuCtrl: MenuController,
    private readonly appStateService: AppStateService, // Inyecta el servicio
    private readonly botonService: BotonService,
  ) {
    this.isAlertActive = this.appStateService.getAlertStatus();
  }
  async ngOnInit() {
    await this.generateDeviceIdAndLocation();

    this.tipoAlerta = this.appStateService.getTipoAlerta();
    this.status = this.botonService.getStatusAlerta();

    //ahora verifico el status cada 1.5 segundos
    setInterval(async () => {
      this.status = this.botonService.getStatusAlerta();
    }, 500);

    this.appStateService.tipoAlerta.subscribe((tipo) => {
      this.tipoAlerta = tipo;
    });
    this.appStateService.statusAlerta.subscribe((status) => {
      this.status = status;
    });

    this.appStateService.currentTitle.subscribe((title) => {
      this.pageTitle = title;
    });

    this.appStateService.currentBackgroundClass.subscribe((backgroundClass) => {
      this.backgroundClass = backgroundClass;
    });
    this.appStateService.isLoading.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.appStateService.isActiveAlert.subscribe((alert) => {
      this.isAlertActive = alert ?? false;
    });
  }
  async openMenu() {
    this.menuCtrl.enable(true, 'main-menu'); // Habilitar el menú con el ID 'main-menu'
    const a = await this.menuCtrl.get('main-menu');
    a?.toggle();
  }
  // Método para navegar y cambiar el título y fondo a través del servicio
  async navigateTo(page: string) {
    await this.router.navigate([`/${page}`]);
    await this.menuCtrl.close();
  }
  showHelp() {
    this.helpBubbleExpanded = !this.helpBubbleExpanded;
  }

  private async generateDeviceIdAndLocation() {
    try {
      const id = await Device.getId();
      this.appStateService.saveIdDevice(id.identifier);
    } catch (error) {
      console.error('Error al obtener el ID del dispositivo:', error);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.appStateService.saveLocation(position.coords);
        },
        (error) => {
          console.error('Error al obtener la localización:', error);
        },
      );
    } else {
      console.error('Geolocalización no es compatible con este navegador.');
    }
  }
  goStatus() {
    if (this.tipoAlerta !== null) {
      this.router.navigate(['send-more-info']);
    } else {
      this.router.navigate(['selecciona']);
    }
  }
}
