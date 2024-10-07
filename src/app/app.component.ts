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
import { MessageModal, StatusAlerta, TipoAlerta } from 'src/domain/alerta';
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
  notification = false;
  isModalAlert: boolean = false;
  modalMessage: MessageModal | null = null;
  constructor(
    private readonly router: Router,
    private readonly menuCtrl: MenuController,
    private readonly appStateService: AppStateService, // Inyecta el servicio
    private readonly botonService: BotonService,
  ) {
    this.isAlertActive = this.appStateService.getIsActiveAlert();
  }
  lastStatus: StatusAlerta | null = null;
  async ngOnInit() {
    await this.generateDeviceIdAndLocation();
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Permiso de notificaciones otorgado.');
      } else {
        console.log('Permiso de notificaciones denegado.');
      }
    });
    this.tipoAlerta = this.appStateService.getTipoAlerta();
    this.status = this.botonService.getStatusAlerta();
    this.lastStatus = this.status;
    this.modalMessage = this.appStateService.getMessageModal();
    setInterval(async () => {
      if (this.isAlertActive !== null && this.isAlertActive) {
        this.status = this.botonService.getStatusAlerta();
      }
    }, 500);

    this.appStateService.tipoAlerta.subscribe((tipo) => {
      this.tipoAlerta = tipo;
    });
    this.appStateService.messageModal.subscribe((message) => {
      this.modalMessage = message;
      if (this.modalMessage !== null) {
        this.isModalAlert = true;
      }
    });

    this.appStateService.statusAlerta.subscribe((status) => {
      this.status = status;
      if (
        this.lastStatus !== this.status &&
        this.status !== null &&
        this.lastStatus !== null &&
        this.isAlertActive
      ) {
        if (Notification.permission === 'granted') {
          const options = {
            body: 'Estado de la alerta: ' + this.status,
            icon: 'assets/icono.png',
            vibrate: [200, 100, 200],
            tag: 'Cambio de estado de la alerta',
            renotify: true,
          };

          const notification = new Notification(
            'Cambio de estado de la alerta',
            options,
          );
          notification.onclick = (event) => {
            window.focus();
            this.router.navigate(['send-more-info']);
          };
        }
        this.notification = true;
        const audio = new Audio('/assets/noti.wav');
        audio.play();
      }
      this.lastStatus = this.status;
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

      if (this.isAlertActive) {
        //dejo que pasen 30 minutos y despues termino la alerta
        setTimeout(() => {
          this.botonService.cancelarAlerta();
        }, 1800000);
        // alos 28 minutos envio a this.botonService.terminadaPorTiempo();
        setTimeout(() => {
          this.botonService.terminarPorTiempo();
        }, 1680000);
      }
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
    this.notification = false;
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
  closeAlertaModal() {
    this.isModalAlert = false;
  }
  goPrincipal() {
    if (this.isAlertActive && this.tipoAlerta !== null) {
      this.router.navigate(['send-more-info']);
      return;
    }
    if (this.isAlertActive) {
      this.router.navigate(['selecciona']);
      return;
    }
    this.router.navigate(['']);
  }
}
