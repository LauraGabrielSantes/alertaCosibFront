import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-legal',
  templateUrl: './legal.page.html',
  styleUrls: ['./legal.page.scss'],
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
export class LegalPage implements OnInit {
  constructor(
    private readonly appStateService: AppStateService, // Inyecta el servicio
    private readonly router: Router,
  ) {}
  opcionActiva = false;
  ionViewWillEnter() {
    this.appStateService.changeTitle('Información Legal');
    this.appStateService.defaultBackground();
  }

  ngOnInit() {}
}
