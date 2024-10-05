import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
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
import { AppStateService } from '../app-state.service'; // Importa el servicio

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  animations: [
    trigger('routerTransition', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', display: 'block !important' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)', display: 'block !important' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
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
  // Propiedades para almacenar el título y el fondo
  pageTitle: string = ''; // Título inicial
  backgroundClass: string = 'background-default'; // Clase de fondo inicial
  isLoading = false;
  constructor(
    private readonly router: Router,
    private readonly menuCtrl: MenuController,
    private readonly appStateService: AppStateService, // Inyecta el servicio
  ) {}

  ngOnInit() {
    this.appStateService.currentTitle.subscribe((title) => {
      this.pageTitle = title;
    });

    this.appStateService.currentBackgroundClass.subscribe((backgroundClass) => {
      this.backgroundClass = backgroundClass;
    });
    this.appStateService.isLoading.subscribe((loading) => {
      this.isLoading = loading;
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
}
