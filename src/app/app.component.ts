import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuController } from '@ionic/angular';
import {
  IonApp,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonNote,
  IonRouterLink,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

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
  ],
})
export class AppComponent {
  // Propiedad para almacenar el título
  pageTitle: string = 'Emergencia'; // Título inicial

  constructor(
    private readonly router: Router,
    private readonly menu: MenuController,
  ) {}

  // Método para navegar y cambiar el título
  async navigateTo(page: string) {
    // Cambia el título según la opción seleccionada
    switch (page) {
      case 'emergencia':
        this.pageTitle = 'Emergencia';
        break;
      case 'servicios':
        this.pageTitle = 'Servicios COSIB';
        break;
      case 'configuracion':
        this.pageTitle = 'Configuración';
        break;
      default:
        this.pageTitle = 'este es el titulo de la pagina'; // Título por defecto
    }

    await this.router.navigate([`/${page}`]);
    await this.menu.close();
  }
}
